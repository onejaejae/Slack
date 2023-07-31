export const ChannelServiceKey = 'ChannelServiceKey';

export interface IChannelService {
  findById(id: number): any;

  getWorkspaceChannels(url: string, userId: number): any;

  getWorkspaceChannel(url: string, name: string): any;

  createWorkspaceChannels(url: string, name: string, userId: number): any;

  getWorkspaceChannelMembers(url: string, name: string): any;

  createWorkspaceChannelMembers(url: string, name: string, email: string): any;

  getWorkspaceChannelChats(
    url: string,
    name: string,
    perPage: number,
    page: number,
  ): any;

  createWorkspaceChannelChats(
    url: string,
    name: string,
    content: string,
    userId: number,
  ): any;

  createWorkspaceChannelImages(
    url: string,
    name: string,
    files: Express.Multer.File[],
    userId: number,
  ): any;

  getChannelUnreadsCount(url: string, name: string, after: number): any;
}
