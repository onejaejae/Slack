import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { ChannelMemberRepository } from './repository/channel.member.repository';

@Module({
  imports: [],
  controllers: [ChannelController],
  providers: [ChannelService, ChannelMemberRepository],
  exports: [ChannelMemberRepository],
})
export class ChannelModule {}
