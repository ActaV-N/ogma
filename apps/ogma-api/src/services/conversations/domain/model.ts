import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { Aggregate } from "~libs";

type ModelType = "fact_check" | "discussion";

type Role = "user" | "assistant";

@Entity()
export class Conversation extends Aggregate {
  @PrimaryColumn()
  id!: string;

  @Column()
  title!: string;

  @Column()
  modelType!: ModelType;

  @OneToMany(() => Message, (message) => message.conversation, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  messages!: Message[];

  @OneToMany(
    () => SearchHistory,
    (searchHistory) => searchHistory.conversation,
    {
      eager: true,
      cascade: true,
      onDelete: "CASCADE",
    }
  )
  searchHistories!: SearchHistory[];

  constructor(args?: { title: string; modelType: ModelType }) {
    super();
    if (args) {
      this.id = uuid();
      this.title = args.title;
      this.modelType = args.modelType;
      this.messages = [];
      this.searchHistories = [];
    }
  }

  toListItem() {
    return {
      id: this.id,
      title: this.title,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  toRetrieveWithDiscussions() {
    return {
      ...this.toListItem(),
      messages: this.messages,
    };
  }

  toRetrieveWithSearchHistories() {
    return {
      ...this.toListItem(),
      searchHistories: this.searchHistories,
    };
  }

  userDiscuss(message: string) {
    this.messages.push(new Message({ role: "user", content: message }));
  }

  assistantDiscuss(message: string) {
    this.messages.push(new Message({ role: "assistant", content: message }));
  }

  addSearchHistory(question: string, answer: object) {
    this.searchHistories.push(new SearchHistory({ question, answer }));
  }
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  conversationId!: string;

  @Column()
  role!: Role;

  @Column({ type: "text" })
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "conversationId" })
  conversation!: never;

  constructor(args?: { role: Role; content: string }) {
    if (args) {
      this.role = args.role;
      this.content = args.content;
    }
  }

  toAnthropicMessage() {
    return {
      role: this.role,
      content: this.content,
    };
  }
}

@Entity()
export class SearchHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  question!: string;

  @Column({
    type: "simple-json",
    transformer: {
      from: (value) => JSON.parse(value),
      to: (value) => JSON.stringify(value),
    },
  })
  answer!: object;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "conversationId" })
  conversation!: never;

  constructor(args?: { question: string; answer: object }) {
    if (args) {
      this.question = args.question;
      this.answer = args.answer;
    }
  }
}
