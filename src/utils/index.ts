import type { WebSocket } from 'ws';

export function emitSocketEvent(
  socket: WebSocket,
  event: string,
  data: unknown
) {
  socket.send(JSON.stringify({ event, data }));
}

export function generatePeerId(): string {
  return `peer-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
