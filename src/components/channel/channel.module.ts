import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { ChannelMemberRepository } from './repository/channel.member.repository';

@Module({
  controllers: [ChannelController],
  providers: [ChannelService, ChannelMemberRepository],
  exports: [ChannelMemberRepository],
})
export class ChannelModule {}
