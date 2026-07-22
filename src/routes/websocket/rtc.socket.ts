import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import type { WebSocket } from 'ws';
import type { types as mediasoupTypes } from 'mediasoup';

import { Room, Peer } from '../../services/room.ts';
import { emitSocketEvent, generatePeerId } from '../../utils/index.ts';
import { authMiddleware } from '../../middlewares/auth.ts';

interface PluginOptions {
  worker: Promise<mediasoupTypes.Worker>;
}

const rooms = new Map<string, Room>();

let waiting1v1UserId: string | null = null;
let waiting1v1RoomId: string | null = null;

const rtcSocketRoutes: FastifyPluginAsync<PluginOptions> = async (
  fastify,
  options
) => {
  const worker = await options.worker;

  fastify.get(
    '/auth/rtc',
    {
      websocket: true,
      preHandler: [authMiddleware],
    },
    async (socket, request) => {
      setupWebsocketEvents(socket, fastify, true, worker, request.userId ?? '');
    }
  );

  fastify.get(
    '/unauth/rtc',
    {
      websocket: true,
    },
    async (socket) => {
      setupWebsocketEvents(socket, fastify, false, worker, '');
    }
  );
};

function setupWebsocketEvents(
  socket: WebSocket,
  fastify: FastifyInstance,
  authenticated: boolean,
  worker: mediasoupTypes.Worker,
  userId: string
) {
  const peerId = authenticated ? userId : generatePeerId();
  let currentRoom: Room | null = null;

  socket.on('close', () => {
    fastify.log.info(`Client disconnected: ${peerId}`);

    if (currentRoom) {
      currentRoom.removePeer(peerId);

      if (currentRoom.peers.size === 0) {
        rooms.delete(currentRoom.id);
      } else {
        currentRoom.broadcast('peerClosed', { peerId }, peerId);
      }
    }

    if (waiting1v1UserId === peerId) {
      waiting1v1UserId = null;
      waiting1v1RoomId = null;
    }
  });

  socket.on('message', async (messageData) => {
    try {
      const { event, data } = JSON.parse(messageData.toString());

      switch (event) {
        case 'joinRoom': {
          let roomId = data.roomId;

          if (roomId === 'random1v1') {
            if (waiting1v1UserId && waiting1v1UserId !== peerId) {
              roomId = waiting1v1RoomId!;
              waiting1v1UserId = null;
              waiting1v1RoomId = null;
            } else {
              roomId = `1v1-${peerId}-${Date.now()}`;
              waiting1v1UserId = peerId;
              waiting1v1RoomId = roomId;
            }
          }

          if (!rooms.has(roomId)) {
            const newRoom = await Room.create(worker, roomId);
            rooms.set(roomId, newRoom);
          }

          currentRoom = rooms.get(roomId)!;

          const peer = new Peer(peerId, socket);
          currentRoom.addPeer(peer);

          emitSocketEvent(socket, 'roomJoined', {
            roomId: currentRoom.id,
            peers: Array.from(currentRoom.peers.keys()),
          });

          currentRoom.broadcast(
            'newPeer',
            {
              peerId,
            },
            peerId
          );

          break;
        }

        case 'getRouterRtpCapabilities': {
          if (!currentRoom) {
            throw new Error('Not in a room');
          }

          emitSocketEvent(socket, 'routerRtpCapabilities', {
            rtpCapabilities: currentRoom.router.rtpCapabilities,
          });

          break;
        }

        case 'createTransport': {
          if (!currentRoom) {
            throw new Error('Not in a room');
          }

          const transport = await currentRoom.createWebRtcTransport(peerId);

          emitSocketEvent(socket, 'transportCreated', {
            transport,
            isProducer: data.isProducer,
          });

          break;
        }

        case 'connectTransport': {
          if (!currentRoom) {
            throw new Error('Not in a room');
          }

          await currentRoom.connectPeerTransport(
            peerId,
            data.transportId,
            data.dtlsParameters
          );

          emitSocketEvent(socket, 'transportConnected', {
            transportId: data.transportId,
          });

          break;
        }
        case 'produce': {
          if (!currentRoom) {
            throw new Error('Not in a room');
          }

          const producer = await currentRoom.produce(
            peerId,
            data.transportId,
            data.rtpParameters,
            data.kind
          );

          emitSocketEvent(socket, 'produced', {
            id: producer.id,
          });

          currentRoom.broadcast(
            'newProducer',
            {
              producerId: producer.id,
              peerId,
            },
            peerId
          );

          break;
        }

        case 'consume': {
          if (!currentRoom) {
            throw new Error('Not in a room');
          }

          const consumer = await currentRoom.consume(
            peerId,
            data.producerId,
            data.transportId,
            data.rtpCapabilities
          );

          emitSocketEvent(socket, 'consumed', consumer);

          break;
        }

        case 'resumeConsumer': {
          if (!currentRoom) {
            throw new Error('Not in a room');
          }

          await currentRoom.resumeConsumer(peerId, data.consumerId);

          emitSocketEvent(socket, 'consumerResumed', {
            consumerId: data.consumerId,
          });

          break;
        }

        case 'getProducers': {
          if (!currentRoom) {
            throw new Error('Not in a room');
          }

          const producers = currentRoom.getProducers(peerId);

          emitSocketEvent(socket, 'producersList', {
            producers,
          });

          break;
        }
        default: {
          fastify.log.warn(`Unknown event: ${event}`);
          break;
        }
      }
    } catch (error) {
      fastify.log.error(error);

      emitSocketEvent(socket, 'error', {
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  socket.on('error', (error) => {
    fastify.log.error(error);
  });
}

export default rtcSocketRoutes;
