import { BaseSchema } from 'src/database/base.schema';
import { Workspace } from '../workspace/common';

export interface User extends BaseSchema {
  id: number;
  email: string;
  nickname: string;
  password: string;
}

export interface UserJoinWithWorkspace extends User {
  Workspaces: Workspace[];
}

export interface VerifiedUser {
  user: Omit<User, 'password'>;
}
