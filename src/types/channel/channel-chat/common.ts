import { BaseSchema } from 'src/types';

export interface IChannelChat extends BaseSchema {
  id: number;
  userId: number | null;
  channelId: number | null;
  content: string;
}
