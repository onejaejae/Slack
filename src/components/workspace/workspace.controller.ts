import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { CreateWorkspaceMemberDto } from './dto/create-workspace.member.dto';
import { User } from 'src/common/decorators/user.decorator';

@Controller('workplaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  // '내 워크스페이스 가져오기'
  @Get()
  async getMyWorkspaces(@User() user) {}

  // '워크스페이스 만들기'
  @Post()
  async createWorkspace(@Body() createWorkspaceDto: CreateWorkspaceDto) {}

  // '워크스페이스 멤버 가져오기'
  @Get(':url/members')
  async getWorkspaceMembers(@Param('url') url: string) {}

  // '워크스페이스 특정멤버 가져오기'
  @Get(':url/members/:id')
  async getWorkspaceMember(
    @Param('url') url: string,
    @Param('id') id: number,
  ) {}

  // '워크스페이스 멤버 초대하기'
  @Post(':url/members')
  async createWorkspaceMembers(
    @Param('url') url: string,
    @Body() createWorkspaceMemberDto: CreateWorkspaceMemberDto,
  ) {}
}
