import { IBaseRepository } from 'src/database/interface/base-repository.interface';
import { ChannelMember } from '../schema/channel.member.schema';

export const ChannelMemberRepositoryKey = 'ChannelMemberRepositoryKey';

export interface IChannelMemberRepository
  extends IBaseRepository<ChannelMember> {}
