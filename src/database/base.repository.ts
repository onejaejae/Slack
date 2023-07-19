import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  EntityManager,
  EntityTarget,
  FindOneOptions,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { TransactionManager } from './transaction.manager';

@Injectable()
export abstract class SlackBaseRepository<T> {
  constructor(
    @Inject(TransactionManager) private readonly txManager: TransactionManager,
  ) {}

  /**
   * getName
   *
   * @description TypeORM에서 Repository를 EntityManager에서 가져올 때 {@link EntityTarget}을 통해 가져오게 된다.
   * EntityTarget의 Union 타입 중 Entity Name으로 Repository를 가져올 수 있다. {@link GenericTypeOrmRepository}를
   * 구현하는 Repository는 getName()만 구현하면 된다.
   */
  abstract getName(): EntityTarget<T>;

  async findByIdOrThrow(id: number): Promise<T> {
    const findOption: FindOneOptions = { where: { id } };
    const res = this.getRepository().findOne(findOption);

    if (!res) {
      throw new BadRequestException(`don't exist ${id}`);
    }
    return res;
  }

  async createEntity(model: T): Promise<T> {
    return this.getRepository().save(model);
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

  protected getQueryRepository(): SelectQueryBuilder<T> {
    return this.txManager
      .getEntityManager()
      .getRepository(this.getName())
      .createQueryBuilder(String(this.getName()).toLowerCase());
  }
}
