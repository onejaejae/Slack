import { Injectable } from '@nestjs/common';
import { ChannelMember } from 'src/components/mapping/schema/channel.member.schema';
import { SlackBaseRepository } from 'src/database/base.repository';
import { EntityTarget } from 'typeorm';

@Injectable()
export class ChannelMemberRepository extends SlackBaseRepository<ChannelMember> {
  getName(): EntityTarget<ChannelMember> {
    return ChannelMember.name;
  }
}
