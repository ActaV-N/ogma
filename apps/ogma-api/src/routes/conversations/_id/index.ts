import { type FastifyInstance } from "fastify";
import { discussionRoutes } from "./discussions";
import { searchHistoriesRoutes } from "./search-histories";

export const idRoutes = async (fastify: FastifyInstance) => {
  fastify.register(discussionRoutes, { prefix: "/discussions" });
  fastify.register(searchHistoriesRoutes, { prefix: "/search-histories" });
};
