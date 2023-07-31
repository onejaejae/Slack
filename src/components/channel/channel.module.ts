import { ClassProvider, Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { ChannelMemberRepository } from './repository/channel.member.repository';
import { ChannelRepository } from './repository/channel.repository';
import { ChannelServiceKey } from './interface/channel-service.interface';

const channelService: ClassProvider = {
  provide: ChannelServiceKey,
  useClass: ChannelService,
};

@Module({
  controllers: [ChannelController],
  providers: [channelService, ChannelRepository, ChannelMemberRepository],
  exports: [ChannelRepository, ChannelMemberRepository],
})
export class ChannelModule {}
