export class SearchHistory {
  id!: string;

  question!: string;

  answer!: {
    id: string;
    citations: string[];
    citationsMeta: {
      url: string;
      title: string | null;
      description: string | null;
      image: string | null;
      favicon: string | null;
    }[];
    choices: {
      index: number;
      message: {
        content: string;
        role: 'user' | 'assistant';
      };
    }[];
  };

  createdAt!: DateString;

  updatedAt!: DateString;
}

export class Message {
  id!: string;

  role!: 'user' | 'assistant';

  content!: string;

  createdAt!: DateString;

  updatedAt!: DateString;
}

export class Conversation {
  id!: string;

  title!: string;

  createdAt!: DateString;

  updatedAt!: DateString;

  messages!: Message[];

  searchHistories!: SearchHistory[];
}
