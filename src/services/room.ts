import type { types as mediasoupTypes } from 'mediasoup';
import mediasoupConfig from '../config/mediasoup.ts';
import envConfig from '../config/environment.ts';

export class Peer {
  id: string;
  socket: any;
  transports: Map<string, mediasoupTypes.Transport> = new Map();
  producers: Map<string, mediasoupTypes.Producer> = new Map();
  consumers: Map<string, mediasoupTypes.Consumer> = new Map();

  constructor(id: string, socket: any) {
    this.id = id;
    this.socket = socket;
  }

  addTransport(transport: mediasoupTypes.Transport) {
    this.transports.set(transport.id, transport);
  }

  getTransport(id: string) {
    return this.transports.get(id);
  }

  addProducer(producer: mediasoupTypes.Producer) {
    this.producers.set(producer.id, producer);
  }

  getProducer(id: string) {
    return this.producers.get(id);
  }

  addConsumer(consumer: mediasoupTypes.Consumer) {
    this.consumers.set(consumer.id, consumer);
  }

  getConsumer(id: string) {
    return this.consumers.get(id);
  }

  close() {
    this.transports.forEach((t) => t.close());
    this.producers.forEach((p) => p.close());
    this.consumers.forEach((c) => c.close());
    this.transports.clear();
    this.producers.clear();
    this.consumers.clear();
  }
}

export class Room {
  id: string;
  router: mediasoupTypes.Router;
  peers: Map<string, Peer> = new Map();

  static async create(worker: mediasoupTypes.Worker, id: string) {
    const router = await worker.createRouter({
      mediaCodecs: mediasoupConfig.mediaCodecs,
    });
    return new Room(id, router);
  }

  private constructor(id: string, router: mediasoupTypes.Router) {
    this.id = id;
    this.router = router;
  }

  addPeer(peer: Peer) {
    this.peers.set(peer.id, peer);
  }

  removePeer(peerId: string) {
    const peer = this.peers.get(peerId);
    if (peer) {
      peer.close();
      this.peers.delete(peerId);
    }
  }

  getPeer(peerId: string) {
    return this.peers.get(peerId);
  }

  async createWebRtcTransport(peerId: string) {
    const transport = await this.router.createWebRtcTransport({
      listenInfos: [
        {
          protocol: 'udp',
          ip: envConfig.PRIVATE_IP || '0.0.0.0',
          announcedAddress: envConfig.PUBLIC_IP || '0.0.0.0',
        },
        {
          protocol: 'tcp',
          ip: envConfig.PRIVATE_IP || '0.0.0.0',
          announcedAddress: envConfig.PUBLIC_IP || '0.0.0.0',
        },
      ],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
      initialAvailableOutgoingBitrate: 1000000,
    });

    const peer = this.getPeer(peerId);
    if (peer) {
      peer.addTransport(transport);
    }

    return {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
      sctpParameters: transport.sctpParameters,
    };
  }

  async connectPeerTransport(
    peerId: string,
    transportId: string,
    dtlsParameters: any
  ) {
    const peer = this.getPeer(peerId);
    if (!peer) throw new Error('Peer not found');
    const transport = peer.getTransport(transportId);
    if (!transport) throw new Error('Transport not found');

    await transport.connect({ dtlsParameters });
  }

  async produce(
    peerId: string,
    transportId: string,
    rtpParameters: any,
    kind: any
  ) {
    const peer = this.getPeer(peerId);
    if (!peer) throw new Error('Peer not found');
    const transport = peer.getTransport(transportId);
    if (!transport) throw new Error('Transport not found');

    const producer = await transport.produce({ kind, rtpParameters });
    peer.addProducer(producer);

    return producer;
  }

  async consume(
    peerId: string,
    producerId: string,
    transportId: string,
    rtpCapabilities: any
  ) {
    const peer = this.getPeer(peerId);
    if (!peer) throw new Error('Peer not found');
    const transport = peer.getTransport(transportId);
    if (!transport) throw new Error('Transport not found');

    if (!this.router.canConsume({ producerId, rtpCapabilities })) {
      throw new Error('Cannot consume');
    }

    const consumer = await transport.consume({
      producerId,
      rtpCapabilities,
      paused: true,
    });

    peer.addConsumer(consumer);

    return {
      id: consumer.id,
      producerId: producerId,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
    };
  }

  async resumeConsumer(peerId: string, consumerId: string) {
    const peer = this.getPeer(peerId);
    if (!peer) throw new Error('Peer not found');
    const consumer = peer.getConsumer(consumerId);
    if (!consumer) throw new Error('Consumer not found');
    await consumer.resume();
  }

  getProducers(
    excludePeerId: string
  ): Array<{ producerId: string; peerId: string }> {
    const producers: Array<{ producerId: string; peerId: string }> = [];
    this.peers.forEach((peer, peerId) => {
      if (peerId !== excludePeerId) {
        peer.producers.forEach((producer) => {
          producers.push({ producerId: producer.id, peerId: peerId });
        });
      }
    });
    return producers;
  }

  broadcast(event: string, data: any, excludePeerId?: string) {
    const payload = JSON.stringify({ event, data });
    this.peers.forEach((peer, peerId) => {
      if (peerId !== excludePeerId) {
        if (peer.socket.readyState === 1 /* OPEN */) {
          peer.socket.send(payload);
        }
      }
    });
  }
}
