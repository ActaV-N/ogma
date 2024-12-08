import { Service } from "typedi";
import { Repository } from "~libs/ddd";

@Service()
export class ConversationRepository extends Repository {
    test() {
        console.log('test');
    }
}
