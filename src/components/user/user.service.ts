import { Injectable } from '@nestjs/common';
import { JoinDto } from './dto/join.dto';

@Injectable()
export class UserService {
  constructor() {}

  getProfile() {}

  login() {}

  join(joinDto: JoinDto) {}

  logout() {}
}
