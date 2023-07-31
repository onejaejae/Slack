import { BaseSchema } from 'src/database/base.schema';

export interface IWorkspace extends BaseSchema {
  id: number;
  name: string;
  url: string;
  ownerId: number | null;
}
