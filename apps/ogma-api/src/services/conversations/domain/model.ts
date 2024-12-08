import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { Aggregate } from "~libs";

type ModelType = "fact_check" | "discussion";

@Entity()
export class Conversation extends Aggregate {
  @PrimaryColumn()
  id!: string;

  @Column()
  title!: string;

  @Column()
  modelType!: ModelType;

  constructor(args?: { title: string; modelType: ModelType }) {
    super();
    if (args) {
      this.id = uuid();
      this.title = args.title;
      this.modelType = args.modelType;
    }
  }
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  conversationId!: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.id)
  @JoinColumn({ referencedColumnName: "id", name: "conversationId" })
  conversation!: never;

  @Column()
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
