import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../user/repository/user.repository';
import { SignInDto } from './dto/signIn.dto';
import { createHash, isSameAsHash } from 'src/common/utils/encrypt';
import { plainToInstance } from 'class-transformer';
import { User, UserWithoutPassword } from '../user/schema/user.schema';
import { Transactional } from 'src/common/decorators/transactional.decorator';
import { JoinDto } from './dto/join.dto';
import { WorkspaceMember } from '../workspace/schema/workspace.member.schema';
import { WorkspaceMemberRepository } from '../workspace/repository/workspace.member.repository';
import { ChannelMember } from '../channel/schema/channel.member.schema';
import { ChannelMemberRepository } from '../channel/repository/channel.member.repository';
import { IAuthService } from './interface/auth-service.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly workspaceMemberRepository: WorkspaceMemberRepository,
    private readonly channelMemberRepository: ChannelMemberRepository,
  ) {}

  @Transactional()
  async join(joinDto: JoinDto) {
    const { password, email, nickname } = joinDto;

    const user = await this.userRepository.findByEmail(email);
    if (user) throw new UnauthorizedException('이미 존재하는 유저입니다.');

    const hashedPassword = await createHash(password);
    const createUser = new User();

    createUser.email = email;
    createUser.nickname = nickname;
    createUser.password = hashedPassword;
    await this.userRepository.createEntity(createUser);

    const workspaceMember = new WorkspaceMember(1, createUser.id);
    await this.workspaceMemberRepository.createEntity(workspaceMember);

    const channelMember = new ChannelMember(1, createUser.id);
    return this.channelMemberRepository.createEntity(channelMember);
  }

  async login(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.userRepository.findByEmail(email);
    if (!user)
      throw new BadRequestException(`email: ${email} don't exist in users`);

    const isSamePassword = await isSameAsHash(password, user.password);
    if (!isSamePassword) {
      throw new BadRequestException(`Incorrect password`);
    }

    const userExcluded = plainToInstance(UserWithoutPassword, user);
    return userExcluded;
  }
}
