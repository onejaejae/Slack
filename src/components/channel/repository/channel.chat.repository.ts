import { Injectable } from '@nestjs/common';
import { ChannelMember } from 'src/components/channel/schema/channel.member.schema';
import { SlackBaseRepository } from 'src/database/base.repository';
import { TransactionManager } from 'src/database/transaction.manager';
import { EntityTarget } from 'typeorm';
import { IChannelMemberRepository } from '../interface/channel-member-repository.interface';
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
}
