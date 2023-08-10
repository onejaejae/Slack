import {
  DataSource,
  Entity,
  EntityTarget,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseSchema } from '../base.schema';
import { SlackBaseRepository } from '../base.repository';
import { TransactionManager } from '../transaction.manager';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  SLACK_ENTITY_MANAGER,
  SLACK_NAMESPACE,
} from 'src/common/middlewares/namespace.constant';
import { createNamespace } from 'cls-hooked';

@Entity()
class Mock extends BaseSchema {
  @PrimaryGeneratedColumn()
  id: number;
}

class MockRepository extends SlackBaseRepository<Mock> {
  getName(): EntityTarget<Mock> {
    return Mock.name;
  }

  constructor(protected readonly txManager: TransactionManager) {
    super(Mock);
  }
}

describe('TypeORM BaseRepository', () => {
  jest.setTimeout(300_000);

  let dataSource: DataSource;
  let mockRepository: MockRepository;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      entities: [Mock],
    });
    await dataSource.initialize();

    const txManager = new TransactionManager();
    mockRepository = new MockRepository(txManager);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('Should be defined', () => {
    expect(dataSource).toBeDefined();
    expect(mockRepository).toBeDefined();
  });

  it('NameSpace가 존재하지 않는 경우', async () => {
    //given
    const e = new Mock();

    //when
    //then
    await expect(mockRepository.createEntity(e)).rejects.toThrowError(
      new InternalServerErrorException(`${SLACK_NAMESPACE} is not active`),
    );
  });

  it('NameSpace가 있지만 active 상태가 아닌 경우', async () => {
    //given
    const e = new Mock();
    createNamespace(SLACK_NAMESPACE);

    //when
    //then
    await expect(mockRepository.createEntity(e)).rejects.toThrowError(
      new InternalServerErrorException(`${SLACK_NAMESPACE} is not active`),
    );
  });

  it('정상적으로 저장 with Create & findOne', async () => {
    //given
    const e = new Mock();
    const namespace = createNamespace(SLACK_NAMESPACE);

    //when
    await namespace.runPromise(async () => {
      //set EntityManager
      await Promise.resolve().then(() =>
        namespace.set(SLACK_ENTITY_MANAGER, dataSource.createEntityManager()),
      );

      // save
      await mockRepository.createEntity(e);

      //then
      const result = await mockRepository.findByIdOrThrow(1);
      expect(result.id).toBe(1);
      expect(result.deletedAt).toBeNull();
      expect(result).not.toBeNull();
      expect(result.createdAt).not.toBeNull();
      expect(result.updatedAt).not.toBeNull();
    });
  });

  it('정상적으로 삭제 with Create & remove & findOne', async () => {
    //given
    const e = new Mock();
    const namespace = createNamespace(SLACK_NAMESPACE);

    //when
    await namespace.runPromise(async () => {
      //set EntityManager
      await Promise.resolve().then(() =>
        namespace.set(SLACK_ENTITY_MANAGER, dataSource.createEntityManager()),
      );

      // save
      await mockRepository.createEntity(e);
      const result = await mockRepository.findByIdOrThrow(1);

      // remove
      await mockRepository.deleteById(1);

      //then
      await expect(mockRepository.findByIdOrThrow(1)).rejects.toThrowError(
        new BadRequestException(`don't exist ${1}`),
      );
    });
  });
});
