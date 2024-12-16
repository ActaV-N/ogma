import { Inject, Service } from "typedi";
import { Service as ApplicationService } from "~libs/ddd";
import { ConversationRepository } from "../infrastructure/repository";
import { Conversation } from "../domain/model";
import { AnthropicClient } from "~libs/anthropic-client";
import { PerplexityClient } from "~libs/perplexity-client";

@Service()
export class ConversationService extends ApplicationService {
  constructor(
    @Inject() private readonly conversationRepository: ConversationRepository,
    @Inject() private readonly anthropicClient: AnthropicClient,
    @Inject() private readonly perplexityClient: PerplexityClient
  ) {
    super();
  }

  async retrieveWithDiscussions(id: string) {
    return this.conversationRepository
      .findOneOrFail(id)
      .then((conversation) => conversation.toRetrieveWithDiscussions());
  }

  async retrieveWithSearchHistories(id: string) {
    return this.conversationRepository
      .findOneOrFail(id)
      .then((conversation) => conversation.toRetrieveWithSearchHistories());
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

    conversation.assistantDiscuss(response);
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
    const conversation =
      await this.conversationRepository.findOneOrFail(conversationId);

    conversation.userDiscuss(message);
    const response = await this.anthropicClient.chat([
      { role: "user", content: conversation.title },
      ...conversation.messages.map((message) => message.toAnthropicMessage()),
    ]);
    conversation.assistantDiscuss(response);

    await this.conversationRepository.save([conversation]);
    return conversation;
  }

  async search({
    conversationId,
    question,
  }: {
    conversationId: string;
    question: string;
  }) {
    const conversation =
      await this.conversationRepository.findOneOrFail(conversationId);

    const answer = await this.perplexityClient.chat([
      { role: "user", content: question },
    ]);

    conversation.addSearchHistory(question, answer);
    await this.conversationRepository.save([conversation]);
    return conversation;
  }
}
