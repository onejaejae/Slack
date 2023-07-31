import { BaseSchema } from 'src/database/base.schema';
import { IWorkspace } from '../workspace/common';

export interface IUser extends BaseSchema {
  id: number;
  email: string;
  nickname: string;
  password: string;
}

export interface UserJoinWithWorkspace extends IUser {
  Workspaces: IWorkspace[];
}

export interface VerifiedUser {
  user: Omit<IUser, 'password'>;
}
