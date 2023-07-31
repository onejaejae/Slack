import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { CreateWorkspaceMemberDto } from './dto/create-workspace.member.dto';
import { VerifiedUser } from 'src/types/user/common';
import { Credentials } from 'src/common/decorators/credential.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import {
  IWorkspaceService,
  WorkspaceServiceKey,
} from './interface/workspace-service.interface';

@UseGuards(AuthGuard)
@Controller('workspaces')
export class WorkspaceController {
  constructor(
    @Inject(WorkspaceServiceKey)
    private readonly workspaceService: IWorkspaceService,
  ) {}

  // '내 워크스페이스 가져오기'
  @Get()
  async getMyWorkspaces(@Credentials() creadentials: VerifiedUser) {
    return this.workspaceService.getMyWorkspaces(creadentials.user.id);
  }

  // '워크스페이스 만들기'
  @Post()
  async createWorkspace(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @Credentials() creadentials: VerifiedUser,
  ) {
    return this.workspaceService.createWorkspace(
      createWorkspaceDto,
      creadentials.user.id,
    );
  }

  // '워크스페이스 멤버 가져오기'
  @Get(':url/members')
  async getWorkspaceMembers(@Param('url') url: string) {
    return this.workspaceService.getWorkspaceMembers(url);
  }

  // '워크스페이스 특정멤버 가져오기'
  @Get(':url/members/:userId')
  async getWorkspaceMember(
    @Param('url') url: string,
    @Param('userId') userId: number,
  ) {
    return this.workspaceService.getWorkspaceMember(url, userId);
  }

  // '워크스페이스 멤버 초대하기'
  @Post(':url/members')
  async createWorkspaceMembers(
    @Param('url') url: string,
    @Body() createWorkspaceMemberDto: CreateWorkspaceMemberDto,
  ) {
    return this.workspaceService.createWorkspaceMembers(
      url,
      createWorkspaceMemberDto,
    );
  }
}
