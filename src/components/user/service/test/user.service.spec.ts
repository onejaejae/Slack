import { Namespace, createNamespace, destroyNamespace } from 'cls-hooked';
import { MySqlContainer, StartedMySqlContainer } from 'testcontainers';
import { DataSource } from 'typeorm';
import { IUserService } from '../../interface/user-service.interface';
import { User } from '../../schema/user.schema';
import { Workspace } from 'src/components/workspace/schema/workspace.schema';
import { TransactionManager } from 'src/database/transaction.manager';
import { UserRepository } from '../../repository/user.repository';
import { UserService } from '../user.service';
import { SLACK_NAMESPACE } from 'src/common/middlewares/namespace.constant';

describe('user service test', () => {
  let container: StartedMySqlContainer;
  let dataSource: DataSource;
  let namespace: Namespace;
  let service: IUserService;

  beforeAll(async () => {
    container = await new MySqlContainer().start();
    dataSource = await new DataSource({
      type: 'mysql',
      host: container.getHost(),
      port: container.getPort(),
      database: container.getDatabase(),
      username: container.getUsername(),
      password: container.getUserPassword(),
      synchronize: true,
      entities: [User, Workspace],
    }).initialize();

    console.log('dataSource', dataSource);

    const txManager = new TransactionManager();
    const userRepository = new UserRepository(txManager);
    service = new UserService(userRepository);
  });

  beforeEach(() => {
    namespace = createNamespace(SLACK_NAMESPACE);
  });

  afterEach(async () => {
    await dataSource.query('TRUNCATE TABLE users CASCADE;');
    await dataSource.query('ALTER SEQUENCE users_id_seq RESTART WITH 1;');
    destroyNamespace(SLACK_NAMESPACE);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await container.stop();
  });

  it('Should be defined', () => {
    expect(container).toBeDefined();
    expect(dataSource).toBeDefined();
    expect(namespace).toBeDefined();
    expect(service).toBeDefined();
  });
});
