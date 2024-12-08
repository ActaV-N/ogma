import { type FastifyInstance } from "fastify";
import post from "./post";

export const conversationsRoutes = async (fastify: FastifyInstance) => {
  fastify.enroll([post]);
};
