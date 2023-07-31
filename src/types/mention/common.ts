import { Union } from '../common';

export interface IMention {
  id: number;
  type: MentionType;
  chatId: number | null;
  workspaceId: number | null;
  senderId: number | null;
  receiverId: number | null;
}

export const MentionType = {
  CHAT: 'chat',
  DM: 'dm',
  SYSTEM: 'system',
};
export type MentionType = Union<typeof MentionType>;
