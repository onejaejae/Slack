import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JoinDto } from './dto/join.dto';
import { UserRepository } from './repository/user.repository';
import { WorkspaceMemberRepository } from '../workspace/repository/workspace.member.repository';
import { ChannelMemberRepository } from '../channel/repository/channel.member.repository';
import { ChannelMember } from '../mapping/schema/channel.member.schema';
import { WorkspaceMember } from '../mapping/schema/workspace.member.schema';
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly workspaceMemberRepository: WorkspaceMemberRepository,
    private readonly channelMemberRepository: ChannelMemberRepository,
  ) {}

  getProfile() {}

  async join(joinDto: JoinDto) {
    const { password, email, nickname } = joinDto;

    const user = await this.userRepository.findByEmail(email);
    if (user) throw new UnauthorizedException('이미 존재하는 유저입니다.');

    const hashedPassword = await bcrypt.hash(password, 12);
    const createdUser = await this.userRepository.save({
      email,
      nickname,
      password: hashedPassword,
    });

    const workspaceMember = new WorkspaceMember();
    workspaceMember.userId = createdUser.id;
    workspaceMember.workspaceId = 1;

    await this.workspaceMemberRepository.createEntity(workspaceMember);

    const channelMember = new ChannelMember();
    channelMember.userId = createdUser.id;
    channelMember.channelId = 1;

    return this.channelMemberRepository.createEntity(channelMember);
  }

  logout() {}
}
