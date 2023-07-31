import { Injectable } from '@nestjs/common';
import { SlackBaseRepository } from 'src/database/base.repository';
import { TransactionManager } from 'src/database/transaction.manager';
import { EntityTarget } from 'typeorm';
import { Channel } from '../schema/channel.schema';
import { IChannelRepository } from '../interface/channel-repository.interface';

@Injectable()
export class ChannelRepository
  extends SlackBaseRepository<Channel>
  implements IChannelRepository
{
  constructor(protected readonly txManager: TransactionManager) {
    super(Channel);
  }

  getName(): EntityTarget<Channel> {
    return Channel.name;
  }
}
