import { ClassProvider, Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { ChannelMemberRepository } from './repository/channel.member.repository';
import { ChannelRepository } from './repository/channel.repository';
import { ChannelServiceKey } from './interface/channel-service.interface';
import { ChannelRepositoryKey } from './interface/channel-repository.interface';
import { ChannelMemberRepositoryKey } from './interface/channel-member-repository.interface';

const channelService: ClassProvider = {
  provide: ChannelServiceKey,
  useClass: ChannelService,
};

export const channelRepository: ClassProvider = {
  provide: ChannelRepositoryKey,
  useClass: ChannelRepository,
};

export const channelMemberRepository: ClassProvider = {
  provide: ChannelMemberRepositoryKey,
  useClass: ChannelMemberRepository,
};

@Module({
  controllers: [ChannelController],
  providers: [channelService, channelRepository, channelMemberRepository],
  exports: [channelRepository, channelMemberRepository],
})
export class ChannelModule {}
