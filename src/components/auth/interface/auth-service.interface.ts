import { ChannelMember } from 'src/components/channel/schema/channel.member.schema';
import { JoinDto } from '../dto/join.dto';
import { SignInDto } from '../dto/signIn.dto';
import { UserWithoutPassword } from 'src/components/user/schema/user.schema';

export const AuthServiceKey = 'AuthServiceKey';

export interface IAuthService {
  join(joinDto: JoinDto): Promise<ChannelMember>;
  login(signInDto: SignInDto): Promise<UserWithoutPassword>;
}
