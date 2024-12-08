import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
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
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;
  
  @Column()
  @ManyToOne(() => Conversation, conversation => conversation.id)
  conversationId!: string;

  @Column()
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
