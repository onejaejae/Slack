import { BaseSchema } from 'src/common/database/base.schema';
import { Channel } from 'src/components/channel/schema/channel.schema';
import { User } from 'src/components/user/schema/user.schema';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ schema: 'slack', name: 'channelMembers' })
export class ChannelMember extends BaseSchema {
  @Column('int', { primary: true })
  channelId: number;

  @Column('int', { primary: true })
  userId: number;

  @ManyToOne(() => Channel, (channel) => channel.ChannelMembers)
  @JoinColumn([{ name: 'channelId', referencedColumnName: 'id' }])
  Channel: Channel;

  @ManyToOne(() => User, (user) => user.ChannelMembers)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  Member: User;
}
