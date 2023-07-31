import { BaseSchema } from 'src/types';

export interface IDM extends BaseSchema {
  id: number;
  workspaceId: number | null;
  senderId: number | null;
  receiverId: number | null;
  content: string;
}
