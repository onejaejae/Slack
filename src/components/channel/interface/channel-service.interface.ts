import { User } from 'src/components/user/schema/user.schema';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { Channel } from '../schema/channel.schema';
import { ChannelChat } from '../schema/channel.chat.schema';

export const ChannelServiceKey = 'ChannelServiceKey';

export interface IChannelService {
  findById(id: number): any;

  getWorkspaceChannels(url: string, userId: number): Promise<Channel[]>;

  getWorkspaceChannel(url: string, name: string): Promise<Channel>;

  getWorkspaceChannelMembers(url: string, name: string): Promise<User[]>;

  getWorkspaceChannelChats(
    url: string,
    name: string,
    perPage: number,
    page: number,
  ): Promise<ChannelChat[]>;

  getChannelUnreadsCount(url: string, name: string, after: number): any;

  createWorkspaceChannels(
    url: string,
    name: string,
    userId: number,
  ): Promise<void>;

  createWorkspaceChannelMembers(
    url: string,
    name: string,
    email: string,
  ): Promise<void>;

  createWorkspaceChannelChats(
    url: string,
    name: string,
    content: string,
    userId: number,
  ): Promise<void>;

  createWorkspaceChannelImages(
    url: string,
    name: string,
    files: Express.Multer.File[],
    userId: number,
  ): any;
}
