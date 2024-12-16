import { plainToInstance } from 'class-transformer';
import { fetchOgTitle, httpClient } from '~/libs';
import { Conversation } from '~models';

export const conversationRepository = {
  retrieveWithDiscussions: async (id: string) => {
    return httpClient
      .get<Conversation>(`/conversations/${id}/discussions`)
      .then((res) => plainToInstance(Conversation, res));
  },

  retrieveWithSearchHistories: async (id: string) => {
    return httpClient
      .get<Conversation>(`/conversations/${id}/search-histories`)
      .then((res) => plainToInstance(Conversation, res))
      .then(async (conversation) => {
        return {
          ...conversation,
          searchHistories: await Promise.all(
            conversation.searchHistories.map(async (searchHistory) => ({
              ...searchHistory,
              answer: {
                ...searchHistory.answer,
                citationsMeta: await Promise.all(
                  searchHistory.answer.citations.map(async (citation) => ({
                    url: citation,
                    title: await fetchOgTitle(citation),
                  }))
                ),
              },
            }))
          ),
        };
      });
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
