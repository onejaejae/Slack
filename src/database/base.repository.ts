import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  EntityManager,
  EntityTarget,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { TransactionManager } from './transaction.manager';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { IBaseRepository } from './interface/base-repository.interface';
import { BaseRepository } from 'src/common/decorators/transactional.decorator2';

@Injectable()
export abstract class SlackBaseRepository<T>
  extends BaseRepository
  implements IBaseRepository<T>
{
  protected abstract readonly txManager: TransactionManager;

  constructor(private readonly classType: ClassConstructor<T>) {
    super();
  }

  /**
   * getName
   *
   * @description TypeORM에서 Repository를 EntityManager에서 가져올 때 {@link EntityTarget}을 통해 가져오게 된다.
   * EntityTarget의 Union 타입 중 Entity Name으로 Repository를 가져올 수 있다. {@link GenericTypeOrmRepository}를
   * 구현하는 Repository는 getName()만 구현하면 된다.
   */
  abstract getName(): EntityTarget<T>;

  async findOneOrThrow(FindOneOptions: FindOptionsWhere<T>): Promise<T> {
    const findOption: FindOneOptions = { where: FindOneOptions };
    const res = this.getRepository().findOne(findOption);

    if (!res) {
      throw new BadRequestException(`don't exist ${FindOneOptions}`);
    }
    return plainToInstance(this.classType, res);
  }

  async findByIdOrThrow(id: number): Promise<T> {
    const findOption: FindOneOptions = { where: { id } };
    const res = await this.getRepository().findOne(findOption);

    if (!res) {
      throw new BadRequestException(`don't exist ${id}`);
    }
    return plainToInstance(this.classType, res);
  }

  async createEntity(model: T): Promise<T> {
    const res = await this.getRepository().save(model);
    return plainToInstance(this.classType, res);
  }

  async createEntity2(model: T): Promise<T> {
    const res = await this.getRepository2().save(model);
    return plainToInstance(this.classType, res);
  }

  async upsert(entity: QueryDeepPartialEntity<T>, options: string[]) {
    return this.getRepository().upsert(entity, options);
  }

  async deleteById(id: number) {
    return this.getRepository().softDelete(id);
  }

  /**
   * getRepository
   *
   * @description 구현을 하는 자식 class에서 getName()을 통해 얻어온 {@link EntityTarget}을 통해
   * {@link EntityManager}에서 Repository를 얻어온다. 해당 method는 구현한 class에서는 호출이 가능하다.
   * @returns repository {@link Repository}
   */
  protected getRepository(): Repository<T> {
    return this.txManager.getEntityManager().getRepository(this.getName());
  }

  protected getRepository2(): Repository<T> {
    return this.manager.getRepository(this.getName);
  }

  protected getQueryBuilder(): SelectQueryBuilder<T> {
    return this.txManager
      .getEntityManager()
      .getRepository(this.getName())
      .createQueryBuilder(String(this.getName()).toLowerCase());
  }
}
