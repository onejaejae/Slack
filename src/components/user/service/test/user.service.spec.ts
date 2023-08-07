import { Namespace, createNamespace, destroyNamespace } from 'cls-hooked';
import { MySqlContainer, StartedMySqlContainer } from 'testcontainers';
import { DataSource } from 'typeorm';
import { IUserService } from '../../interface/user-service.interface';
import { User, UserJoinWithWorkspace } from '../../schema/user.schema';
import { Workspace } from 'src/components/workspace/schema/workspace.schema';
import { TransactionManager } from 'src/database/transaction.manager';
import { UserRepository } from '../../repository/user.repository';
import { UserService } from '../user.service';
import {
  SLACK_ENTITY_MANAGER,
  SLACK_NAMESPACE,
} from 'src/common/middlewares/namespace.constant';
import { WorkspaceMember } from 'src/components/workspace/schema/workspace.member.schema';
import { Channel } from 'src/components/channel/schema/channel.schema';
import { DM } from 'src/components/dm/schema/dm.schema';
import { Mention } from 'src/components/mention/schema/mention.schema';
import { ChannelMember } from 'src/components/channel/schema/channel.member.schema';
import { ChannelChat } from 'src/components/channel/schema/channel.chat.schema';
import { plainToInstance } from 'class-transformer';
import { hashSync } from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

const mockUser: User = plainToInstance(User, {
  email: 'test@email.com',
  nickname: 'test',
  password: hashSync('test', 10),
});

describe('user service test', () => {
  // for testContainers
  jest.setTimeout(300_000);

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
      entities: [
        User,
        Workspace,
        WorkspaceMember,
        Channel,
        DM,
        Mention,
        ChannelMember,
        ChannelChat,
      ],
    }).initialize();

    const txManager = new TransactionManager();
    const userRepository = new UserRepository(txManager);
    service = new UserService(userRepository);
  });

  beforeEach(() => {
    namespace = createNamespace(SLACK_NAMESPACE);
  });

  afterEach(async () => {
    await dataSource.query('DELETE FROM users;');
    await dataSource.query('ALTER TABLE users AUTO_INCREMENT = 1;');
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

  it('getProfile - user가 존재하지 않는 경우', async () => {
    // given
    const email = 'test';

    // when
    // then
    await expect(
      namespace.runPromise(async () => {
        namespace.set(SLACK_ENTITY_MANAGER, dataSource.manager);
        await service.getProfile(email);
      }),
    ).rejects.toThrowError(
      new BadRequestException(`email: ${email} don't exist`),
    );
  });

  it('getProfile - user가 존재하는 경우', async () => {
    // given
    const user = await dataSource.manager.save(User, mockUser);
    const email = user.email;

    // when
    const result = await namespace.runAndReturn<Promise<UserJoinWithWorkspace>>(
      async () => {
        namespace.set(SLACK_ENTITY_MANAGER, dataSource.manager);
        return service.getProfile(email);
      },
    );

    //then
    expect(result.id).toBe(1);
    expect(result.email).toBe(email);
    expect(result.nickname).toBe(user.nickname);
    expect(result.password).toBeUndefined();
  });
});
