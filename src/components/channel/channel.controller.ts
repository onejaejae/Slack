import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { GetWorkspaceChannelChatsQueryDto } from './dto/getWorkspaceChannelChats.query.dto';
import { CreateWorkspaceMembersDto } from './dto/create-workspace-members.dto';
import { CreateWorkspaceChannelChatsDto } from './dto/create-workspace-channel.chats.dto';
import { GetUnreadChannelsQueryDto } from './dto/getUnreadChannels.query.dto';
import {
  ChannelServiceKey,
  IChannelService,
} from './interface/channel-service.interface';
import { Credentials } from 'src/common/decorators/credential.decorator';
import { VerifiedUser } from 'src/types/user/common';
import { AuthGuard } from 'src/common/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('workspaces')
export class ChannelController {
  constructor(
    @Inject(ChannelServiceKey) private readonly channelService: IChannelService,
  ) {}

  // 워크스페이스 채널 모두 가져오기
  @Get(':url/channels')
  async getWorkspaceChannels(
    @Param('url') url: string,
    @Credentials() credential: VerifiedUser,
  ) {
    return this.channelService.getWorkspaceChannels(url, credential.user.id);
  }

  // 워크스페이스 특정 채널 가져오기
  @Get(':url/channels/:name')
  async getWorkspaceChannel(
    @Param('url') url: string,
    @Param('name') name: string,
  ) {
    return this.channelService.getWorkspaceChannel(url, name);
  }

  // '워크스페이스 채널 멤버 가져오기'
  @Get(':url/channels/:name/members')
  async getWorkspaceChannelMembers(
    @Param('url') url: string,
    @Param('name') name: string,
  ) {
    return this.channelService.getWorkspaceChannelMembers(url, name);
  }

  // '워크스페이스 특정 채널 채팅 모두 가져오기'
  @Get(':url/channels/:name/chats')
  async getWorkspaceChannelChats(
    @Param('url') url,
    @Param('name') name,
    @Query() getWorkspaceChannelChatsQueryDto: GetWorkspaceChannelChatsQueryDto,
  ) {}

  // '안 읽은 개수 가져오기'
  @Get(':url/channels/:name/unreads')
  async getUnreads(
    @Param('url') url: string,
    @Param('name') name: string,
    @Query() getUnreadChannelsQueryDto: GetUnreadChannelsQueryDto,
  ) {}

  // '워크스페이스 채널 만들기'
  @Post(':url/channels')
  async createWorkspaceChannels(
    @Param('url') url,
    @Body() body: CreateChannelDto,
  ) {}

  // '워크스페이스 채널 멤버 초대하기'
  @Post(':url/channels/:name/members')
  async createWorkspaceMembers(
    @Param('url') url: string,
    @Param('name') name: string,
    @Body() createWorkspaceMembersDto: CreateWorkspaceMembersDto,
  ) {}

  // '워크스페이스 특정 채널 채팅 생성하기'
  @Post(':url/channels/:name/chats')
  async createWorkspaceChannelChats(
    @Param('url') url,
    @Param('name') name,
    @Body() createWorkspaceChannelChatsDto: CreateWorkspaceChannelChatsDto,
  ) {}

  // '워크스페이스 특정 채널 이미지 업로드하기'
  @Post(':url/channels/:name/images')
  async createWorkspaceChannelImages(
    @Param('url') url: string,
    @Param('name') name: string,
  ) {}
}
