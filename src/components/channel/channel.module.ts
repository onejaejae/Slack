import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { ChannelMemberRepository } from './repository/channel.member.repository';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ChannelController],
  providers: [ChannelService, ChannelMemberRepository],
  exports: [ChannelMemberRepository],
})
export class ChannelModule {}
