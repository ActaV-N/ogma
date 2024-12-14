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
}
