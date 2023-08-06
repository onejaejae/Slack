import { BaseSchema } from '../../../database/base.schema';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Workspace } from '../../workspace/schema/workspace.schema';
import { User } from '../../user/schema/user.schema';
import { IMention, MentionType } from '../../../types/mention/common';

@Entity({ schema: 'sleact', name: 'mentions' })
export class Mention extends BaseSchema implements IMention {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('enum', { name: 'type', enum: MentionType })
  type: MentionType;

  @Column('int', { name: 'chatId', nullable: true })
  chatId: number | null;

  @Column('int', { name: 'workspaceId', nullable: true })
  workspaceId: number | null;

  @Column('int', { name: 'senderId', nullable: true })
  senderId: number | null;

  @Column('int', { name: 'receiverId', nullable: true })
  receiverId: number | null;

  @ManyToOne(() => Workspace, (workspace) => workspace.Mentions, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'workspaceId', referencedColumnName: 'id' }])
  Workspace: Workspace;

  @ManyToOne(() => User, (user) => user.Mentions, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'senderId', referencedColumnName: 'id' }])
  Sender: User;

  @ManyToOne(() => User, (user) => user.Mentions2, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'receiverId', referencedColumnName: 'id' }])
  Receiver: User;
}
