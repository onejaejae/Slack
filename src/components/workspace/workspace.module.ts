import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { WorkspaceMemberRepository } from './repository/workspace.member.repository';
import { WorkspaceRepository } from './repository/workspace.repository';
import { ChannelModule } from '../channel/channel.module';

@Module({
  imports: [ChannelModule],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceRepository, WorkspaceMemberRepository],
  exports: [WorkspaceMemberRepository],
})
export class WorkspaceModule {}
