import { BaseSchema } from '..';

export interface IChannel extends BaseSchema {
  id: number;
  name: string;
  workspaceId: number | null;
}
