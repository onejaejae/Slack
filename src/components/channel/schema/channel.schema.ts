import { BaseSchema } from 'src/common/database/base.schema';
import { ChannelChat } from 'src/components/mapping/schema/channel.chat.schema';
import { ChannelMember } from 'src/components/mapping/schema/channel.member.schema';
import { User } from 'src/components/user/schema/user.schema';
import { Workspace } from 'src/components/workspace/schema/workspace.schema';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ schema: 'slack', name: 'channels' })
export class Channel extends BaseSchema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('tinyint', {
    name: 'private',
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  private: boolean | null;

  @Column({ nullable: true })
  workspaceId: number | null;

  @ManyToOne(() => Workspace, (workspace) => workspace.Channels, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'workspaceId', referencedColumnName: 'id' }])
  Workspace: Workspace;

  @OneToMany(() => ChannelMember, (channelMember) => channelMember.Channel, {
    cascade: ['insert'],
  })
  ChannelMembers: ChannelMember[];

  @OneToMany(() => ChannelChat, (channelChat) => channelChat.Channel)
  ChannelChats: ChannelChat[];

  @ManyToMany(() => User, (user) => user.Channels)
  Members: User[];
}
