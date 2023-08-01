export const UserServiceKey = 'UserServiceKey';

export interface IUserService {
  getProfile(email: string): any;
}
