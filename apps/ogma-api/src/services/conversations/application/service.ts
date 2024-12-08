import { Inject, Service } from "typedi";
import { Service as ApplicationService } from "~libs/ddd";
import { ConversationRepository } from "../infrastructure/repository";

@Service()
export class ConversationService extends ApplicationService {
  constructor(
    @Inject() private readonly conversationRepository: ConversationRepository
  ) {
    super();
  }

  async register() {
    this.conversationRepository.test();
  }
}
