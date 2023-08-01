import { BaseSchema } from '../../../database/base.schema';
import { Channel } from './channel.schema';
import { User } from '../../user/schema/user.schema';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IChannelChat } from 'src/types/channel/channel-chat/common';

@Entity({ schema: 'slack', name: 'channelChats' })
export class ChannelChat extends BaseSchema implements IChannelChat {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('text', { name: 'content' })
  content: string;

  @Column('int', { nullable: true })
  userId: number | null;

  @Column('int', { nullable: true })
  channelId: number | null;

  constructor(content: string, userId: number, channelId: number) {
    super();
    this.content = content;
    this.userId = userId;
    this.channelId = channelId;
  }

  @ManyToOne(() => Channel, (channel) => channel.ChannelChats, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'channelId', referencedColumnName: 'id' }])
  Channel: Channel;

  @ManyToOne(() => User, (user) => user.ChannelChats, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  Member: User;
}
