import { ClassProvider, Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { WorkspaceMemberRepository } from './repository/workspace.member.repository';
import { WorkspaceRepository } from './repository/workspace.repository';
import { ChannelModule } from '../channel/channel.module';
import { UserModule } from '../user/user.module';
import { WorkspaceServiceKey } from './interface/workspace-service.interface';

const workspaceService: ClassProvider = {
  provide: WorkspaceServiceKey,
  useClass: WorkspaceService,
};
@Module({
  imports: [ChannelModule, UserModule],
  controllers: [WorkspaceController],
  providers: [workspaceService, WorkspaceRepository, WorkspaceMemberRepository],
  exports: [WorkspaceMemberRepository],
})
export class WorkspaceModule {}
