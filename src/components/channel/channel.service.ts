import { Inject, Injectable } from '@nestjs/common';
import { IChannelService } from './interface/channel-service.interface';
import {
  ChannelRepositoryKey,
  IChannelRepository,
} from './interface/channel-repository.interface';

@Injectable()
export class ChannelService implements IChannelService {
  constructor(
    @Inject(ChannelRepositoryKey)
    private readonly channelRepository: IChannelRepository,
  ) {}

  findById(id: number) {
    throw new Error('Method not implemented.');
  }
  getWorkspaceChannels(url: string, userId: number) {
    return this.channelRepository.getWorkspaceChannels(url, userId);
  }
  getWorkspaceChannel(url: string, name: string) {
    return this.channelRepository.getWorkspaceChannel(url, name);
  }
  getWorkspaceChannelMembers(url: string, name: string) {
    return this.channelRepository.getWorkspaceChannelMembers(url, name);
  }
  getWorkspaceChannelChats(
    url: string,
    name: string,
    perPage: number,
    page: number,
  ) {
    throw new Error('Method not implemented.');
  }
  createWorkspaceChannelMembers(url: string, name: string, email: string) {
    throw new Error('Method not implemented.');
  }

  createWorkspaceChannels(url: string, name: string, userId: number) {
    throw new Error('Method not implemented.');
  }

  createWorkspaceChannelChats(
    url: string,
    name: string,
    content: string,
    userId: number,
  ) {
    throw new Error('Method not implemented.');
  }
  createWorkspaceChannelImages(
    url: string,
    name: string,
    files: Express.Multer.File[],
    userId: number,
  ) {
    throw new Error('Method not implemented.');
  }
  getChannelUnreadsCount(url: string, name: string, after: number) {
    throw new Error('Method not implemented.');
  }
}
