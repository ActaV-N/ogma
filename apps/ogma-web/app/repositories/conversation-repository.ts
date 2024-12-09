import { plainToInstance } from 'class-transformer';
import { httpClient } from '~/libs';
import { Conversation } from '~models';

const conversationRepository = {
  getConversations: async () => {
    return httpClient.get<Conversation[]>('/conversations').then((res) => plainToInstance(Conversation, res));
  },
};

export { conversationRepository };
