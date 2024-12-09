import { FastifyReply, FastifyRequest } from "fastify";
import { ConversationService } from "~services/conversations/application/service";

export default {
  path: "/",
  method: "get",
  opts: {},
  handler: async (request: FastifyRequest, reply: FastifyReply) => {
    // 0. ctx destructuring
    const { context } = request;

    // 1. fetch service
    const conversationService = context.get(ConversationService);

    // 2. define parameter
    // 3. call service method
    const conversations = await conversationService.list();

    // 4. response
    return reply.status(200).send(conversations);
  },
} satisfies RouterSpec;
