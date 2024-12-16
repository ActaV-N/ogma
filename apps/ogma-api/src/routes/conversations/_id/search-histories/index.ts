import { type FastifyInstance } from "fastify";
import get from "./get";

export const searchHistoriesRoutes = async (fastify: FastifyInstance) => {
  fastify.enroll([get]);
};
