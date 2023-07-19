import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { WorkspaceMemberRepository } from './repository/workspace.member.repository';

@Module({
  imports: [],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceMemberRepository],
  exports: [WorkspaceMemberRepository],
})
export class WorkspaceModule {}
