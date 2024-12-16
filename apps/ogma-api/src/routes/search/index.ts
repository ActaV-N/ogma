import { type FastifyInstance } from "fastify";
import { conversationIdRoutes } from "./_conversationId";

export const searchRoutes = async (fastify: FastifyInstance) => {
  fastify.register(conversationIdRoutes, { prefix: "/:conversationId" });
};
