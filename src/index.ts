import Fastify from 'fastify';
// import { PeerServer } from 'peer';
// import createWorker from './config/mediasoup.ts';
import fastifyCors from '@fastify/cors';
// import fastifyWebsocket from '@fastify/websocket';
// import fastifyStatic from '@fastify/static';

import config from './config/environment.ts';
// import { createWorker } from './services/mediasoup.ts';
// import rtcSocketRoutes from './routes/websocket/rtc.socket.ts';

import authApiRoutes from './routes/api/auth.api.ts';

const fastify = Fastify({
  logger: true,
});
// const worker = createWorker();
fastify.register(fastifyCors, {
  origin: [
    'https://dev.castepic.com',
    'http://localhost:5173',
    'http://localhost:5174',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
});

// fastify.register(fastifyWebsocket);

fastify.register(authApiRoutes, { prefix: '/auth' });

// if (config.NODE_ENV === 'production') {
//   fastify.register(fastifyStatic, {
//     root: config.WEB_DIST_PATH,
//     prefix: '/',
//     wildcard: true,
//   });

//   fastify.setNotFoundHandler((request, reply) => {
//     reply.sendFile('index.html');
//   });
// }

// fastify.get('/k', { websocket: true }, (connection) => {
//   // 'connection.socket' is a standard 'ws' library instance
//   connection.on('message', (message) => {
//     fastify.log.info(`Received message: ${message}`);

//     connection.send(`Echo: ${message}`);
//   });

//   // connection.on('getRouterRtpCapabilities', (message) => {
//   //   fastify.log.info(`Connection established: ${message}`);
//   //   connection.send(`Echo: ${message}`);
//   // });

//   connection.on('close', () => {
//     fastify.log.info('Client disconnected');
//   });
// });

// Initialize Mediasoup (for future SFU use)
// createWorker();

// fastify.get('/k',  (connection) => {
//   // 'connection.socket' is a standard 'ws' library instance

// });

// Run the Fastify server!
fastify.listen({ port: config.PORT }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Fastify server listening on ${address}`);
});

// Run the PeerJS Signaling Server for 1-1 P2P
// const peerServer = PeerServer({ port: config.PEER_PORT, path: '/myapp' });

// peerServer.on('connection', (client) => {
//   console.log(`Peer client connected: ${client.getId()}`);
// });

// peerServer.on('disconnect', (client) => {
//   console.log(`Peer client disconnected: ${client.getId()}`);
// });

console.log('PeerJS Signaling Server running on port 9000 at path /myapp');
