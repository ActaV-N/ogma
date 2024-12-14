import { type FastifyInstance } from "fastify";
import get from "./get";
import post from "./post";
import { idRoutes } from "./_id";

export const conversationsRoutes = async (fastify: FastifyInstance) => {
  fastify.register(idRoutes, { prefix: "/:id" });
  fastify.enroll([get, post]);
};
