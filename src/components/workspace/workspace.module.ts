import { ClassProvider, Module, forwardRef } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { WorkspaceMemberRepository } from './repository/workspace.member.repository';
import { WorkspaceRepository } from './repository/workspace.repository';
import { ChannelModule } from '../channel/channel.module';
import { UserModule } from '../user/user.module';
import { WorkspaceServiceKey } from './interface/workspace-service.interface';
import { WorkspaceRepositoryKey } from './interface/workspace-repository.interface';
import { WorkspaceMemberRepositoryKey } from './interface/workspace-member-repository.interface';
import { WorkspaceRepositoryKey2 } from './interface/workspace-repository2.interface';
import { WorkspaceRepository2 } from './repository/workspace.repository2';

const workspaceService: ClassProvider = {
  provide: WorkspaceServiceKey,
  useClass: WorkspaceService,
};

const workspaceRepository: ClassProvider = {
  provide: WorkspaceRepositoryKey,
  useClass: WorkspaceRepository,
};

const workspaceRepository2: ClassProvider = {
  provide: WorkspaceRepositoryKey2,
  useClass: WorkspaceRepository2,
};

const workspaceMemberRepository: ClassProvider = {
  provide: WorkspaceMemberRepositoryKey,
  useClass: WorkspaceMemberRepository,
};

@Module({
  imports: [forwardRef(() => ChannelModule), UserModule],
  controllers: [WorkspaceController],
  providers: [
    workspaceService,
    workspaceRepository,
    workspaceMemberRepository,
    workspaceRepository2,
  ],
  exports: [workspaceRepository, workspaceMemberRepository],
})
export class WorkspaceModule {}
