import { ConversationService } from "~services/conversations/application/service";

export default {
  path: "/",
  method: "get",
  opts: { websocket: true },
  handler: async (socket, request) => {
    // 0. ctx destructuring
    const { context } = request;

    // 1. fetch service
    // 2. define parameter
    const { conversationId } = request.params as { conversationId: string };
    // 3. call service method
    // 4. response

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
