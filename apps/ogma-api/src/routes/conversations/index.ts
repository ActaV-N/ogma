import { type FastifyInstance } from "fastify";
import get from "./get";
import post from "./post";

export const conversationsRoutes = async (fastify: FastifyInstance) => {
  fastify.enroll([get, post]);
};
