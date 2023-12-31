import { BaseSchema } from '../../../database/base.schema';
import { Channel } from './channel.schema';
import { User } from '../../user/schema/user.schema';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IChannelMember } from 'src/types/channel/channel-member/common';

@Entity({ schema: 'slack', name: 'channelMembers' })
export class ChannelMember extends BaseSchema implements IChannelMember {
  @Column('int', { primary: true })
  channelId: number;

  @Column('int', { primary: true })
  userId: number;

  constructor(channelId: number, userId: number) {
    super();
    this.channelId = channelId;
    this.userId = userId;
  }

  @ManyToOne(() => Channel, (channel) => channel.ChannelMembers)
  @JoinColumn([{ name: 'channelId', referencedColumnName: 'id' }])
  Channel: Channel;

  @ManyToOne(() => User, (user) => user.ChannelMembers)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  Member: User;
}
