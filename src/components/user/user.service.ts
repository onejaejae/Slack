import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { WorkspaceMemberRepository } from '../workspace/repository/workspace.member.repository';
import { ChannelMemberRepository } from '../channel/repository/channel.member.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly workspaceMemberRepository: WorkspaceMemberRepository,
    private readonly channelMemberRepository: ChannelMemberRepository,
  ) {}

  getProfile() {}
}
