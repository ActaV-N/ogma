import { ConversationService } from "~services/conversations/application/service";

export default {
  path: "/",
  method: "get",
  opts: { websocket: true },
  handler: async (socket, request) => {
    const conversationService = request.context.get(ConversationService);
    conversationService.register();
    const { conversationId } = request.params as { conversationId: string };

    socket.on("message", (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        // 메시지 처리 로직을 여기에 구현

        // 클라이언트에게 응답 전송
        socket.send(
          JSON.stringify({
            type: "message",
            conversationId,
            data,
          })
        );
      } catch (error) {
        socket.send(
          JSON.stringify({
            type: "error",
            message: "Invalid message format",
          })
        );
      }
    });

    // 연결 종료 처리
    socket.on("close", () => {
      console.log(`Client disconnected from conversation: ${conversationId}`);
    });
  },
} satisfies RouterSpec;
