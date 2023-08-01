import { Inject, Injectable } from '@nestjs/common';
import {
  IUserRepository,
  UserRepositoryKey,
} from './interface/user-repository.interface';
import { IUserService } from './interface/user-service.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(UserRepositoryKey) private readonly userRepository: IUserRepository,
  ) {}

  async getProfile(email: string) {
    return this.userRepository.joinWithWorkspace(email);
  }
}
