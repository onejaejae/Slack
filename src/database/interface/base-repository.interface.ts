import { IGenericRepository } from 'src/common/decorators/transactional.decorator2';
import { FindOptionsWhere } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

/**
 * GenericRepository
 *
 * @description Database가 변경되더라도 해당 GenericRepository를 구현하여 Repository Layer구현
 */
export interface IBaseRepository<T> extends IGenericRepository {
  findOneOrThrow(FindOneOptions: FindOptionsWhere<T>): Promise<T>;
  findByIdOrThrow(id: number): Promise<T>;
  createEntity(model: T): Promise<T>;
  createEntity2(model: T): Promise<T>;
  upsert(entity: QueryDeepPartialEntity<T>, options: string[]);
}
