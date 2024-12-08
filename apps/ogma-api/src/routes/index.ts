import { type FastifyInstance } from "fastify";
import { chatRoutes } from "./chat";
import { conversationsRoutes } from "./conversations";

export const appRoutes = async function (fastify: FastifyInstance) {
  fastify.register(chatRoutes, { prefix: "/chat" });
  fastify.register(conversationsRoutes, { prefix: "/conversations" });
};
