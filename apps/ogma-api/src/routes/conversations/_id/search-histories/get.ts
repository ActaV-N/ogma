import { FastifyReply, FastifyRequest } from "fastify";
import { ConversationService } from "~services/conversations/application/service";

export default {
  path: "/",
  method: "get",
  opts: {
    schema: {
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
        additionalProperties: false,
      },
    },
  },
  handler: async (request: FastifyRequest, reply: FastifyReply) => {
    // 0. ctx destructuring
    const { context } = request;

    // 1. fetch service
    const conversationService = context.get(ConversationService);

    // 2. define parameter
    const { id } = request.params as { id: string };
    // 3. call service method
    const conversation =
      await conversationService.retrieveWithSearchHistories(id);

    // 4. response
    return reply.status(200).send(conversation);
  },
} satisfies RouterSpec;
