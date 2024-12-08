import { Service } from "typedi";
import { Repository } from "~libs/ddd/typeorm";
import { Conversation } from "../domain/model";

@Service()
export class ConversationRepository extends Repository<Conversation> {
  protected entityClass = Conversation;

  async find() {
    return this.entityManager.find(this.entityClass);
  }

  async findOneOrFail(id: string) {
    return this.entityManager.findOneOrFail(Conversation, {
      where: { id },
    });
  }
}
