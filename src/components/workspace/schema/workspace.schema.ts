import { BaseSchema } from 'src/common/database/base.schema';
import { Channel } from 'src/components/channel/schema/channel.schema';
import { User } from 'src/components/user/schema/user.schema';
import { WorkspaceMember } from 'src/components/mapping/schema/workspace.member.schema';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DM } from 'src/components/dm/schema/dm.schema';
import { Mention } from 'src/components/mention/schema/mention.schema';

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
