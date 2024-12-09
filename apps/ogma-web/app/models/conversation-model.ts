export class Message {
  id!: string;

  role!: 'user' | 'assistant';

  content!: string;

  createdAt!: Date;

  updatedAt!: Date;
}

export class Conversation {
  id!: string;

  title!: string;

  createdAt!: Date;

  updatedAt!: Date;
  
  messages!: Message[];
}
