import { Injectable } from '@nestjs/common';
import { WorkspaceRepository } from './repository/workspace.repository';
import { Transactional } from 'src/common/decorators/transactional.decorator';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { Workspace } from './schema/workspace.schema';
import { WorkspaceMember } from './schema/workspace.member.schema';
import { ChannelMember } from '../channel/schema/channel.member.schema';
import { Channel } from '../channel/schema/channel.schema';
import { WorkspaceMemberRepository } from './repository/workspace.member.repository';
import { ChannelRepository } from '../channel/repository/channel.repository';
import { ChannelMemberRepository } from '../channel/repository/channel.member.repository';
import { UserRepository } from '../user/repository/user.repository';

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly workspaceMemberRepository: WorkspaceMemberRepository,
    private readonly channelRepository: ChannelRepository,
    private readonly channelMemberRepository: ChannelMemberRepository,
  ) {}

  @Transactional()
  async getMyWorkspaces(userId: number) {
    return this.workspaceRepository.findMyWorkspaces(userId);
  }

  @Transactional()
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
}
