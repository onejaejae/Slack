import { IBaseRepository } from 'src/database/interface/base-repository.interface';
import { DM } from '../schema/dm.schema';

export const DMRepositoryKey = 'DMRepositoryKey';

export interface IDMRepository extends IBaseRepository<DM> {}
