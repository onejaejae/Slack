import { BaseSchema } from 'src/types';

export interface IChannelMember extends BaseSchema {
  channelId: number;
  userId: number;
}
