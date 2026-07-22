import type { FastifyReply, FastifyRequest } from 'fastify';

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const payload = await request.jwtVerify<{
      id?: string;
      userId?: string;
      sub?: string;
    }>();

    request.userId = payload.userId ?? payload.id ?? payload.sub ?? '';
  } catch {
    return reply.status(401).send({
      success: false,
      message: 'Unauthorized',
    });
  }
}
