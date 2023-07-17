import { BaseSchema } from '../../../database/base.schema';
import { Channel } from '../../channel/schema/channel.schema';
import { User } from '../../user/schema/user.schema';
import { WorkspaceMember } from '../../mapping/schema/workspace.member.schema';
import { DM } from '../../dm/schema/dm.schema';
import { Mention } from '../../mention/schema/mention.schema';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ schema: 'slack', name: 'workspaces' })
export class Workspace extends BaseSchema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { unique: true, length: 30 })
  name: string;

  @Column('varchar', { unique: true, length: 30 })
  url: string;

  @Column('int', { nullable: true })
  ownerId: number | null;

  @ManyToOne(() => User, (user) => user.OwnedWorkspaces, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ownerId', referencedColumnName: 'id' }])
  Owner: User;

  @OneToMany(
    () => WorkspaceMember,
    (workspaceMember) => workspaceMember.Workspace,
  )
  WorkspaceMembers: WorkspaceMember[];

  @OneToMany(() => Channel, (channel) => channel.Workspace)
  Channels: Channel[];

  @OneToMany(() => DM, (dm) => dm.Workspace)
  DMs: DM[];

  @OneToMany(() => Mention, (mention) => mention.Workspace)
  Mentions: Mention[];

  @ManyToMany(() => User, (user) => user.Workspaces)
  Members: User[];
}
