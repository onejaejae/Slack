import { BaseSchema } from '../../../database/base.schema';
import { ChannelChat } from './channel.chat.schema';
import { ChannelMember } from './channel.member.schema';
import { User } from '../../user/schema/user.schema';
import { Workspace } from '../../workspace/schema/workspace.schema';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IChannel } from 'src/types/channel/common';

@Entity({ schema: 'slack', name: 'channels' })
export class Channel extends BaseSchema implements IChannel {
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

  constructor(name: string, workspaceId: number) {
    super();
    this.name = name;
    this.workspaceId = workspaceId;
  }

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
