import { BaseSchema } from 'src/database/base.schema';

export interface Workspace extends BaseSchema {
  id: number;
  name: string;
  url: string;
  ownerId: number | null;
}
