import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IChannelService } from './interface/channel-service.interface';
import {
  ChannelRepositoryKey,
  IChannelRepository,
} from './interface/channel-repository.interface';
import {
  IWorkspaceRepository,
  WorkspaceRepositoryKey,
} from '../workspace/interface/workspace-repository.interface';
import { Channel } from './schema/channel.schema';
import { ChannelMember } from './schema/channel.member.schema';
import {
  ChannelMemberRepositoryKey,
  IChannelMemberRepository,
} from './interface/channel-member-repository.interface';
import {
  IUserRepository,
  UserRepositoryKey,
} from '../user/interface/user-repository.interface';

@Injectable()
export class ChannelService implements IChannelService {
  constructor(
    @Inject(ChannelRepositoryKey)
    private readonly channelRepository: IChannelRepository,
    @Inject(ChannelMemberRepositoryKey)
    private readonly channelMemberRepository: IChannelMemberRepository,
    @Inject(WorkspaceRepositoryKey)
    private readonly workspaceRepository: IWorkspaceRepository,
    @Inject(UserRepositoryKey)
    private readonly userRepository: IUserRepository,
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

  async createWorkspaceChannels(url: string, name: string, userId: number) {
    const workspace = await this.workspaceRepository.findOneOrThrow({ url });

    const newChannel = new Channel(name, workspace.id);
    await this.channelRepository.createEntity(newChannel);

    const newChannelMember = new ChannelMember(newChannel.id, userId);
    await this.channelMemberRepository.createEntity(newChannelMember);
  }

  async createWorkspaceChannelMembers(
    url: string,
    name: string,
    email: string,
  ) {
    const channel = await this.channelRepository.getWorkspaceChannel(url, name);
    if (!channel)
      throw new BadRequestException(
        `channel name:${name} don't exist in workspace url:${url} `,
      );

    const user = await this.userRepository.joinWithWorkspace(email);
    if (!user.isWorkspaceMember(url))
      throw new BadRequestException(
        `user email:${email} don't participate workspace url: ${name}`,
      );

    const newChannelMember = new ChannelMember(channel.id, user.id);
    await this.channelMemberRepository.createEntity(newChannelMember);
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
