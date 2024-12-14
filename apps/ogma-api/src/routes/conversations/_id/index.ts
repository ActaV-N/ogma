import { type FastifyInstance } from "fastify";
import get from "./get";

export const idRoutes = async (fastify: FastifyInstance) => {
  fastify.enroll([get]);
};
