import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { WorkspaceDmChatsQueryDto } from './dto/workspace-dm-chats.query.dto';
import { DmUnreadQueryDto } from './dto/dm-unread.query.dto';
import { CreateWorkspaceDmChatDto } from './dto/create-workspace-dm-chat.dto';
import { DMServiceKey, IDMService } from './interface/dm-service.interface';

@Controller('workspaces')
export class DmController {
  constructor(@Inject(DMServiceKey) private readonly dmService: IDMService) {}

  // '워크스페이스 DM 모두 가져오기'
  @Get(':url/dms')
  async getWorkspaceChannels(@Param('url') url) {}

  // '워크스페이스 특정 DM 채팅 모두 가져오기'
  @Get(':url/dms/:dmId/chats')
  async getWorkspaceDMChats(
    @Param('url') url: string,
    @Param('dmId', ParseIntPipe) dmId: number,
    @Query() workspaceDmChatsQueryDto: WorkspaceDmChatsQueryDto,
  ) {}

  // '안 읽은 개수 가져오기'
  @Get(':url/dms/:dmId/unreads')
  async getUnreads(
    @Param('url') url: number,
    @Param('dmId') dmId: number,
    @Query() dmUnreadQueryDto: DmUnreadQueryDto,
  ) {}

  // '워크스페이스 특정 DM 채팅 생성하기'
  @Post(':url/dms/:dmId/chats')
  async createWorkspaceDMChats(
    @Param('url') url: string,
    @Param('dmId') dmId: number,
    @Body() createWorkspaceDmChatDto: CreateWorkspaceDmChatDto,
  ) {}

  // '워크스페이스 특정 DM 이미지 업로드하기'
  @Post(':url/dms/:dmId/images')
  async createWorkspaceDMImages(
    @Param('url') url,
    @Param('dmId') dmId: number,
  ) {}
}
