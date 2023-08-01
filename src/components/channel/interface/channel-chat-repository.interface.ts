import { IBaseRepository } from 'src/database/interface/base-repository.interface';
import { ChannelChat } from '../schema/channel.chat.schema';

export const ChannelChatRepositoryKey = 'ChannelChatRepositoryKey';

export interface IChannelChatRepository extends IBaseRepository<ChannelChat> {
  getWorkspaceChannelChats(
    url: string,
    name: string,
    perPage: number,
    page: number,
  ): Promise<ChannelChat[]>;
  joinWithUserAndChannel(channelId: number): Promise<ChannelChat>;
  getUnreadChatCount(channelChatId: number, after: number): Promise<number>;
}
