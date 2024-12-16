import { type FastifyInstance } from "fastify";
import get from "./get";

export const discussionRoutes = async (fastify: FastifyInstance) => {
  fastify.enroll([get]);
};
