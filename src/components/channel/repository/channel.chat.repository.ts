import { Injectable } from '@nestjs/common';
import { SlackBaseRepository } from 'src/database/base.repository';
import { TransactionManager } from 'src/database/transaction.manager';
import { EntityTarget, MoreThan } from 'typeorm';
import { ChannelChat } from '../schema/channel.chat.schema';
import { IChannelChatRepository } from '../interface/channel-chat-repository.interface';

@Injectable()
export class ChannelChatRepository
  extends SlackBaseRepository<ChannelChat>
  implements IChannelChatRepository
{
  constructor(protected readonly txManager: TransactionManager) {
    super(ChannelChat);
  }

  getName(): EntityTarget<ChannelChat> {
    return ChannelChat.name;
  }

  async getWorkspaceChannelChats(
    url: string,
    name: string,
    perPage: number,
    page: number,
  ): Promise<ChannelChat[]> {
    return this.getQueryBuilder()
      .innerJoin('channelchat.Channel', 'channel', 'channel.name = :name', {
        name,
      })
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .innerJoinAndSelect('channelchat.Member', 'user')
      .orderBy('channelchat.createdAt', 'DESC')
      .take(perPage)
      .skip(perPage * (page - 1))
      .getMany();
  }

  async joinWithUserAndChannel(channelId: number): Promise<ChannelChat> {
    return this.getRepository().findOne({
      where: { id: channelId },
      relations: ['Channel', 'Member'],
    });
  }

  async getUnreadChatCount(channelId: number, after: number): Promise<number> {
    return this.getRepository().count({
      where: { channelId, createdAt: MoreThan(new Date(after)) },
    });
  }
}
