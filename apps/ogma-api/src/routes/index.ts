import { type FastifyInstance } from "fastify";
import { chatRoutes } from "./chat";
import { conversationsRoutes } from "./conversations";
import { searchRoutes } from "./search";

export const appRoutes = async function (fastify: FastifyInstance) {
  fastify.register(chatRoutes, { prefix: "/chat" });
  fastify.register(conversationsRoutes, { prefix: "/conversations" });
  fastify.register(searchRoutes, { prefix: "/search" });
};
