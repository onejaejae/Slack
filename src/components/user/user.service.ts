import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JoinDto } from './dto/join.dto';
import { UserRepository } from './repository/user.repository';
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  getProfile() {}

  async join(joinDto: JoinDto) {
    const { password, email, nickname } = joinDto;

    const user = await this.userRepository.findByEmail(email);

    if (user) throw new UnauthorizedException('이미 존재하는 유저입니다.');

    const hashedPassword = await bcrypt.hash(password, 12);
    return this.userRepository.save({
      email,
      nickname,
      password: hashedPassword,
    });
  }

  logout() {}
}
