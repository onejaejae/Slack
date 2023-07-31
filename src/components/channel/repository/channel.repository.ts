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

  async getWorkspaceChannels(url: string, userId: number): Promise<Channel[]> {
    return this.getQueryBuilder()
      .innerJoinAndSelect(
        'channel.ChannelMembers',
        'channerMembers',
        'channerMembers.userId = :userId',
        { userId },
      )
      .innerJoinAndSelect(
        'channel.Workspace',
        'workspace',
        'workspace.url = :url',
        { url },
      )
      .getMany();
  }

  async getWorkspaceChannel(url: string, name: string): Promise<Channel> {
    return this.getQueryBuilder()
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .where('channel.name = :name', { name })
      .getOne();
  }

  async getWorkspaceChannelMembers(
    url: string,
    name: string,
  ): Promise<Channel> {
    return this.getQueryBuilder()
      .innerJoinAndSelect('channel.ChannelMembers', 'channelMembers')
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .where('channel.name = :name', { name })
      .getOne();
  }
}
