import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { ChannelMemberRepository } from './repository/channel.member.repository';
import { ChannelRepository } from './repository/channel.repository';

@Module({
  controllers: [ChannelController],
  providers: [ChannelService, ChannelRepository, ChannelMemberRepository],
  exports: [ChannelRepository, ChannelMemberRepository],
})
export class ChannelModule {}
