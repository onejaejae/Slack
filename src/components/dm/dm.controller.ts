import { Controller, Get, Param } from '@nestjs/common';
import { DmService } from './dm.service';

@Controller('dms')
export class DmController {
  constructor(private readonly dmService: DmService) {}

  @Get(':url/dms')
  async getWorkspaceChannels(@Param('url') url) {}

  @Get(':url/dms/:dmId/chats')
  async getWorkspaceDMChats(
    @Param('url') url,
    @Param('id', ParseIntPipe) id: number,
    @Query('perPage', ParseIntPipe) perPage: number,
    @Query('page', ParseIntPipe) page: number,
    @User() user: Users,
  ) {
    return this.dmsService.getWorkspaceDMChats(url, id, user.id, perPage, page);
  }
}
