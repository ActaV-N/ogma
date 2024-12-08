import { Inject, Service } from "typedi";
import { Service as ApplicationService } from "~libs/ddd";
import { ConversationRepository } from "../infrastructure/repository";
import { Conversation } from "../domain/model";

@Service()
export class ConversationService extends ApplicationService {
  constructor(
    @Inject() private readonly conversationRepository: ConversationRepository
  ) {
    super();
  }

  async create(args: { title: string; modelType: Conversation["modelType"] }) {
    const conversation = new Conversation(args);
    await this.conversationRepository.save([conversation]);

    return conversation;
  }
}
