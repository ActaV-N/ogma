import { ConversationService } from "~services/conversations/application/service";

export default {
  path: "/",
  method: "get",
  opts: { websocket: true },
  handler: async (socket, request) => {
    // 0. ctx destructuring
    const { context } = request;

    // 1. fetch service
    const conversationService = context.get(ConversationService);

    // 2. define parameter
    const { conversationId } = request.params as { conversationId: string };

    // 3. call service method
    // 4. response

    // Handle incoming messages
    socket.addEventListener("message", async (event: MessageEvent) => {
      const message = event.data;
      const conversation = await conversationService.discuss({
        conversationId,
        message,
      });

      socket.send(
        JSON.stringify({
          type: "message",
          conversationId,
          data: conversation.messages.slice(-1)[0],
        })
      );
    });

    // 연결 종료 처리
    socket.addEventListener("close", () => {
      console.log(`Client disconnected from conversation: ${conversationId}`);
    });
  },
} satisfies RouterSpec;
