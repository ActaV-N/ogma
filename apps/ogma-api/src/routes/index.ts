import { type FastifyInstance } from 'fastify';
import { chatRoutes } from './chat';

export const appRoutes = async function (fastify: FastifyInstance) {
  fastify.register(chatRoutes, { prefix: '/chat' });
};
