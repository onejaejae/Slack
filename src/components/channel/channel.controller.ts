import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { GetWorkspaceChannelChatsQueryDto } from './dto/getWorkspaceChannelChats.query.dto';
import { CreateWorkspaceMembersDto } from './dto/create-workspace-members.dto';
import { CreateWorkspaceChannelChatsDto } from './dto/create-workspace-channel.chats.dto';
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
  ) {
    return this.channelService.getWorkspaceChannelChats(
      url,
      name,
      getWorkspaceChannelChatsQueryDto.perPage,
      getWorkspaceChannelChatsQueryDto.page,
    );
  }

  // '안 읽은 개수 가져오기'
  @Get(':url/channels/:name/unreads')
  async getUnreads(
    @Param('url') url: string,
    @Param('name') name: string,
    @Query('after', ParseIntPipe) after: number,
  ) {
    return this.channelService.getChannelUnreadsCount(url, name, after);
  }

  // '워크스페이스 채널 만들기'
  @Post(':url/channels')
  async createWorkspaceChannels(
    @Param('url') url,
    @Body() createChannelDto: CreateChannelDto,
    @Credentials() credential: VerifiedUser,
  ) {
    return this.channelService.createWorkspaceChannels(
      url,
      createChannelDto.name,
      credential.user.id,
    );
  }

  // '워크스페이스 채널 멤버 초대하기'
  @Post(':url/channels/:name/members')
  async createWorkspaceMembers(
    @Param('url') url: string,
    @Param('name') name: string,
    @Body() createWorkspaceMembersDto: CreateWorkspaceMembersDto,
  ) {
    return this.channelService.createWorkspaceChannelMembers(
      url,
      name,
      createWorkspaceMembersDto.email,
    );
  }

  // '워크스페이스 특정 채널 채팅 생성하기'
  @Post(':url/channels/:name/chats')
  async createWorkspaceChannelChats(
    @Param('url') url,
    @Param('name') name,
    @Body() createWorkspaceChannelChatsDto: CreateWorkspaceChannelChatsDto,
    @Credentials() credential: VerifiedUser,
  ) {
    return this.channelService.createWorkspaceChannelChats(
      url,
      name,
      createWorkspaceChannelChatsDto.content,
      credential.user.id,
    );
  }

  // '워크스페이스 특정 채널 이미지 업로드하기'
  @Post(':url/channels/:name/images')
  async createWorkspaceChannelImages(
    @Param('url') url: string,
    @Param('name') name: string,
  ) {}
}
