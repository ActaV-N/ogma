import { Inject, Service } from "typedi";
import { Service as ApplicationService } from "~libs/ddd";
import { ConversationRepository } from "../infrastructure/repository";
import { Conversation } from "../domain/model";
import { AnthropicClient } from "~libs/anthropic-client";

@Service()
export class ConversationService extends ApplicationService {
  constructor(
    @Inject() private readonly conversationRepository: ConversationRepository,
    @Inject() private readonly anthropicClient: AnthropicClient
  ) {
    super();
  }

  async list() {
    return this.conversationRepository
      .find()
      .then((conversations) =>
        conversations.map((conversation) => conversation.toListItem())
      );
  }

  async create(args: { title: string; modelType: Conversation["modelType"] }) {
    const conversation = new Conversation(args);

    const response = await this.anthropicClient.chat([
      { role: "user", content: conversation.title },
    ]);

    conversation.assistantAnswer(response);
    await this.conversationRepository.save([conversation]);
    return conversation;
  }

  async discuss({
    conversationId,
    message,
  }: {
    conversationId: string;
    message: string;
  }) {
    const conversation = await this.conversationRepository.findOneOrFail(
      conversationId
    );

    conversation.userAsk(message);
    const response = await this.anthropicClient.chat([
      { role: "user", content: conversation.title },
      ...conversation.messages.map((message) => message.toAnthropicMessage()),
    ]);
    conversation.assistantAnswer(response);

    await this.conversationRepository.save([conversation]);
    return conversation;
  }
}
