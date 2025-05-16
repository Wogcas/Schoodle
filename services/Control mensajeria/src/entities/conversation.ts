import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Message } from './message';

@Entity({ name: 'conversation' })
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  participantA: string;

  @Column()
  participantB: string;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
