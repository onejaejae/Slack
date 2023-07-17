import { BaseSchema } from 'src/common/database/base.schema';
import { Channel } from 'src/components/channel/schema/channel.schema';
import { User } from 'src/components/user/schema/user.schema';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ schema: 'slack', name: 'channelChats' })
export class ChannelChat extends BaseSchema {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('text', { name: 'content' })
  content: string;

  @Column('int', { nullable: true })
  userId: number | null;

  @Column('int', { nullable: true })
  channelId: number | null;

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
