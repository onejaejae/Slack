import { IBaseRepository } from 'src/database/interface/base-repository.interface';
import { Channel } from '../schema/channel.schema';

export const ChannelRepositoryKey = 'ChannelRepositoryKey';

export interface IChannelRepository extends IBaseRepository<Channel> {
  getWorkspaceChannels(url: string, userId: number): Promise<Channel[]>;
  getWorkspaceChannel(url: string, name: string): Promise<Channel>;
}
