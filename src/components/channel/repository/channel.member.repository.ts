import { Injectable } from '@nestjs/common';
import { ChannelMember } from 'src/components/channel/schema/channel.member.schema';
import { SlackBaseRepository } from 'src/database/base.repository';
import { TransactionManager } from 'src/database/transaction.manager';
import { EntityTarget } from 'typeorm';

@Injectable()
export class ChannelMemberRepository extends SlackBaseRepository<ChannelMember> {
  constructor(protected readonly txManager: TransactionManager) {
    super(ChannelMember);
  }

  getName(): EntityTarget<ChannelMember> {
    return ChannelMember.name;
  }
}
