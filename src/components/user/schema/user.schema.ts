import { Exclude } from 'class-transformer';
import { BaseSchema } from '../../../database/base.schema';
import { Channel } from '../../channel/schema/channel.schema';
import { DM } from '../../dm/schema/dm.schema';
import { ChannelChat } from '../../channel/schema/channel.chat.schema';
import { ChannelMember } from '../../channel/schema/channel.member.schema';
import { WorkspaceMember } from '../../workspace/schema/workspace.member.schema';
import { Mention } from '../../mention/schema/mention.schema';
import { Workspace } from '../../workspace/schema/workspace.schema';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ schema: 'slack', name: 'users' })
export class User extends BaseSchema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { unique: true, length: 30 })
  email: string;

  @Column('varchar', { length: 30 })
  nickname: string;

  @Column('varchar', { length: 100, select: false })
  password: string;

  @OneToMany(() => Workspace, (workspace) => workspace.Owner)
  OwnedWorkspaces: Workspace[];

  @OneToMany(() => WorkspaceMember, (workspaceMember) => workspaceMember.User)
  WorkspaceMembers: WorkspaceMember[];

  @OneToMany(() => ChannelMember, (channelMember) => channelMember.Member)
  ChannelMembers: ChannelMember[];

  @OneToMany(() => ChannelChat, (channelChat) => channelChat.Member)
  ChannelChats: ChannelChat[];

  @OneToMany(() => DM, (dm) => dm.Sender)
  Dms: DM[];

  @OneToMany(() => DM, (dm) => dm.Receiver)
  Dms2: DM[];

  @OneToMany(() => Mention, (mention) => mention.Sender)
  Mentions: Mention[];

  @OneToMany(() => Mention, (mention) => mention.Receiver)
  Mentions2: Mention[];

  @ManyToMany(() => Workspace, (workspace) => workspace.Members)
  @JoinTable({
    name: 'workspacemembers',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'workspaceId',
      referencedColumnName: 'id',
    },
  })
  Workspaces: Workspace[];

  @ManyToMany(() => Channel, (channel) => channel.Members)
  @JoinTable({
    name: 'channelMembers',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'channelId',
      referencedColumnName: 'id',
    },
  })
  Channels: Channel[];
}

export class UserWithoutPassword extends User {
  @Exclude()
  declare password: string;

  session: string;
}
