import { ClassProvider, Module, forwardRef } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { ChannelMemberRepository } from './repository/channel.member.repository';
import { ChannelRepository } from './repository/channel.repository';
import { ChannelServiceKey } from './interface/channel-service.interface';
import { ChannelRepositoryKey } from './interface/channel-repository.interface';
import { ChannelMemberRepositoryKey } from './interface/channel-member-repository.interface';
import { WorkspaceModule } from '../workspace/workspace.module';
import { UserModule } from '../user/user.module';
import { ChannelChatRepositoryKey } from './interface/channel-chat-repository.interface';
import { ChannelChatRepository } from './repository/channel.chat.repository';

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

export const channelChatRepository: ClassProvider = {
  provide: ChannelChatRepositoryKey,
  useClass: ChannelChatRepository,
};

@Module({
  imports: [forwardRef(() => WorkspaceModule), UserModule],
  controllers: [ChannelController],
  providers: [
    channelService,
    channelRepository,
    channelMemberRepository,
    channelChatRepository,
  ],
  exports: [channelRepository, channelMemberRepository],
})
export class ChannelModule {}
