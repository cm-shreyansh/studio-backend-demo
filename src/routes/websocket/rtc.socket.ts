// import type {Fastify} from 'fastify';

import type { FastifyPluginAsync } from 'fastify';
// import { createWorker } from '../../services/mediasoup.ts';
import type { types as mediasoupTypes } from 'mediasoup';
import config from '../../config/mediasoup.ts';
interface PluginOptions {
  worker: Promise<mediasoupTypes.Worker>;
}

const rtcSocketRoutes: FastifyPluginAsync<PluginOptions> = async function (
  fastify,
  options
) {
  fastify.get('/', { websocket: true }, async (socket) => {
    const worker = await options.worker;
    const router = await worker.createRouter({
      mediaCodecs: config.mediaCodecs,
    });

    socket.on('message', (message) => {
      fastify.log.info(`Received: ${message}`);
      socket.send(`Echo: ${message}`);
    });
    socket.on('getRouterRtpCapabilities', () => {
      try {
        const response = {
          rtpCapabilities: router.rtpCapabilities,
        };
        socket.send(JSON.stringify(response));
      } catch (error) {
        fastify.log.error(`Error getting router RTP capabilities: ${error}`);
        socket.send(
          JSON.stringify({ error: 'Failed to get router RTP capabilities' })
        );
      }
    });
    socket.on('createTransport', (message) => {
      fastify.log.info(`Received: ${message}`);
      socket.send(`Echo: ${message}`);
    });
    socket.on('connectProducerTransport', (message) => {
      fastify.log.info(`Received: ${message}`);
      socket.send(`Echo: ${message}`);
    });
    socket.on('transport-produce', (message) => {
      fastify.log.info(`Received: ${message}`);
      socket.send(`Echo: ${message}`);
    });
    socket.on('consumeMedia', (message) => {
      fastify.log.info(`Received: ${message}`);
      socket.send(`Echo: ${message}`);
    });
    socket.on('resumePausedConsumer', (message) => {
      fastify.log.info(`Received: ${message}`);
      socket.send(`Echo: ${message}`);
    });
    socket.on('close', () => {
      fastify.log.info('Client disconnected');
    });
  });
};

export default rtcSocketRoutes;
