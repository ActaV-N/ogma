import { plainToInstance } from 'class-transformer';
import { httpClient } from '~/libs';
import { Conversation } from '~models';

export const conversationRepository = {
  list: async () => {
    return httpClient.get<Conversation[]>('/conversations').then((res) => plainToInstance(Conversation, res));
  },
};
