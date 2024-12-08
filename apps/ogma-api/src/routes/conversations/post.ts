import { FastifyReply, FastifyRequest } from "fastify";
import { ConversationService } from "~services/conversations/application/service";
import { Conversation } from "~services/conversations/domain/model";

export default {
  path: "/",
  method: "post",
  opts: {
    schema: {
      body: {
        type: "object",
        properties: {
          title: { type: "string" },
          modelType: { type: "string" },
        },
        required: ["title", "modelType"],
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
    // TODO: 타입 추론 가능하게 할 수 있나?
    const { title, modelType } = request.body as {
      title: string;
      modelType: Conversation["modelType"];
    };

    // 3. call service method
    const conversation = await conversationService.create({
      title,
      modelType,
    });

    // 4. response
    return reply.status(201).send(conversation.id);
  },
} satisfies RouterSpec;
