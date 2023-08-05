import { InternalServerErrorException } from '@nestjs/common';
import { Transactional } from './transactional.decorator';
import {
  SLACK_ENTITY_MANAGER,
  SLACK_NAMESPACE,
} from '../middlewares/namespace.constant';
import { createNamespace } from 'cls-hooked';
import { DataSource } from 'typeorm';

class TransactionTest {
  @Transactional()
  test() {
    console.log('Transaction test excecute');
  }
}

describe('Transactional Decorator Test', () => {
  let mock: TransactionTest;

  beforeEach(() => {
    mock = new TransactionTest();
  });

  it('nameSpce가 없이 실행되는 경우', async () => {
    await expect(mock.test()).rejects.toThrowError(
      new InternalServerErrorException(`${SLACK_NAMESPACE} is not active`),
    );
  });

  it('nameSpce는 있지만 active 상태가 아닌 경우', async () => {
    createNamespace(SLACK_NAMESPACE);

    await expect(mock.test()).rejects.toThrowError(
      new InternalServerErrorException(`${SLACK_NAMESPACE} is not active`),
    );
  });

  it('NameSpace는 active 상태이지만, entityManager가 없는 경우', async () => {
    const nameSpace = createNamespace(SLACK_NAMESPACE);
    await expect(
      nameSpace.runPromise(async () => Promise.resolve().then(mock.test)),
    ).rejects.toThrowError(
      new InternalServerErrorException(
        `Could not find EntityManager in ${SLACK_NAMESPACE} nameSpace`,
      ),
    );
  });

  it('NameSpace는 active 상태, entityManager 있는 경우 (정상)', async () => {
    const nameSpace = createNamespace(SLACK_NAMESPACE);

    const dataSource = await new DataSource({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
    }).initialize();
    const em = dataSource.createEntityManager();

    await expect(
      nameSpace.runPromise(async () => {
        nameSpace.set(SLACK_ENTITY_MANAGER, em);
        await Promise.resolve().then(mock.test);
      }),
    ).resolves.not.toThrowError();
  });
});
