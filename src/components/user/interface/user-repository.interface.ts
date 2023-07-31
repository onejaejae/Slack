import { IBaseRepository } from 'src/database/interface/base-repository.interface';
import { User } from '../schema/user.schema';

export const UserRepositoryKey = 'UserRepositoryKey';

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User>;
  getWorkspaceMember(url: string, userId: number): Promise<User>;
  getWorkspaceMembers(url: string): Promise<User[]>;
}