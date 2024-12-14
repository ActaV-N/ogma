import { plainToInstance } from 'class-transformer';
import { httpClient } from '~/libs';
import { Conversation } from '~models';

export const conversationRepository = {
  retrieve: async (id: string) => {
    return httpClient
      .get<Conversation>(`/conversations/${id}`)
      .then((res) => plainToInstance(Conversation, res));
  },

  list: async () => {
    return httpClient
      .get<Conversation[]>('/conversations')
      .then((res) => plainToInstance(Conversation, res));
  },

  create: async (params: { title: string; modelType: string }) => {
    return httpClient.post<{
      id: string;
      title: string;
      createdAt: DateString;
      updatedAt: DateString;
    }>('/conversations', params);
  },
};
