import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { WorkspaceRepository } from './repository/workspace.repository';
import { Transactional } from 'src/common/decorators/transactional.decorator';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { Workspace } from './schema/workspace.schema';
import { WorkspaceMember } from './schema/workspace.member.schema';
import { ChannelMember } from '../channel/schema/channel.member.schema';
import { Channel } from '../channel/schema/channel.schema';
import { WorkspaceMemberRepository } from './repository/workspace.member.repository';
import { CreateWorkspaceMemberDto } from './dto/create-workspace.member.dto';
import { IWorkspaceService } from './interface/workspace-service.interface';
import {
  ChannelRepositoryKey,
  IChannelRepository,
} from '../channel/interface/channel-repository.interface';
import {
  ChannelMemberRepositoryKey,
  IChannelMemberRepository,
} from '../channel/interface/channel-member-repository.interface';
import {
  IUserRepository,
  UserRepositoryKey,
} from '../user/interface/user-repository.interface';

@Injectable()
export class WorkspaceService implements IWorkspaceService {
  constructor(
    @Inject(UserRepositoryKey)
    private readonly userRepository: IUserRepository,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly workspaceMemberRepository: WorkspaceMemberRepository,
    @Inject(ChannelRepositoryKey)
    private readonly channelRepository: IChannelRepository,
    @Inject(ChannelMemberRepositoryKey)
    private readonly channelMemberRepository: IChannelMemberRepository,
  ) {}

  async getMyWorkspaces(userId: number) {
    return this.workspaceRepository.findMyWorkspaces(userId);
  }

  async getWorkspaceMember(url: string, userId: number) {
    return this.userRepository.getWorkspaceMember(url, userId);
  }

  async getWorkspaceMembers(url: string) {
    return this.userRepository.getWorkspaceMembers(url);
  }

  @Transactional()
  async createWorkspace(
    createWorkspaceDto: CreateWorkspaceDto,
    userId: number,
  ) {
    const { name, url } = createWorkspaceDto;

    const newWorkspace = new Workspace(name, url, userId);
    const workspace = await this.workspaceRepository.createEntity(newWorkspace);

    const newWorkspaceMember = new WorkspaceMember(workspace.id, userId);
    await this.workspaceMemberRepository.createEntity(newWorkspaceMember);

    const newChannel = new Channel('일반', workspace.id);
    const channel = await this.channelRepository.createEntity(newChannel);

    const newChannelMember = new ChannelMember(channel.id, userId);
    await this.channelMemberRepository.createEntity(newChannelMember);
  }

  @Transactional()
  async createWorkspaceMembers(
    url: string,
    createWorkspaceMemberDto: CreateWorkspaceMemberDto,
  ) {
    const { email } = createWorkspaceMemberDto;

    const workspace = await this.workspaceRepository.joinChannel(url);
    const user = await this.userRepository.findOneOrThrow({ email });

    const newWorkspaceMember = new WorkspaceMember(workspace.id, user.id);
    await this.workspaceMemberRepository.createEntity(newWorkspaceMember);

    const targetChannel = workspace.Channels.find(
      (channel) => channel.name === '일반',
    );
    if (!targetChannel)
      throw new BadRequestException(`channel name: 일반 don't exist`);

    const newChannelMember = new ChannelMember(targetChannel.id, user.id);
    await this.channelMemberRepository.createEntity(newChannelMember);
  }
}
