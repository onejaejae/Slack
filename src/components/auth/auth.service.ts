import { Injectable } from '@nestjs/common';
import { IValidateUserDto } from './dto/validate.user.dto';
import { UserRepository } from '../user/repository/user.repository';
import bycrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async validateUser(validateUserDto: IValidateUserDto) {
    const user = await this.userRepository.findByEmail(validateUserDto.email);

    if (!user) return null;

    const isPasswordSame = await bycrypt.compare(
      validateUserDto.password,
      user.password,
    );

    if (isPasswordSame) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }
}
