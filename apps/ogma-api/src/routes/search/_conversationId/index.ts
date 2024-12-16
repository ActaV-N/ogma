import { type FastifyInstance } from "fastify";
import get from "./get";

export const conversationIdRoutes = async (fastify: FastifyInstance) => {
  fastify.enroll([get]);
};
