import { BaseSchema } from '../../../database/base.schema';
import { User } from '../../user/schema/user.schema';
import { Workspace } from '../../workspace/schema/workspace.schema';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ schema: 'slack', name: 'workspacemembers' })
export class WorkspaceMember extends BaseSchema {
  @Column('int', { primary: true })
  workspaceId: number;

  @Column('int', { primary: true })
  userId: number;

  @Column('datetime', { name: 'loggedInAt', nullable: true })
  loggedInAt: Date | null;

  @ManyToOne(() => User, (user) => user.WorkspaceMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  User: User;

  @ManyToOne(() => Workspace, (workspace) => workspace.WorkspaceMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'workspaceId', referencedColumnName: 'id' }])
  Workspace: Workspace;
}
