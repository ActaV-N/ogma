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
  })
  messages!: Message[];

  constructor(args?: { title: string; modelType: ModelType }) {
    super();
    if (args) {
      this.id = uuid();
      this.title = args.title;
      this.modelType = args.modelType;
      this.messages = [];
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

  userAsk(message: string) {
    this.messages.push(new Message({ role: "user", content: message }));
  }

  assistantAnswer(message: string) {
    this.messages.push(new Message({ role: "assistant", content: message }));
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

  @Column()
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
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
