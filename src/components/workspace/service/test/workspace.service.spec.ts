import { Namespace, createNamespace, destroyNamespace } from 'cls-hooked';
import { MySqlContainer, StartedMySqlContainer } from 'testcontainers';
import { DataSource } from 'typeorm';
import { Workspace } from 'src/components/workspace/schema/workspace.schema';
import { TransactionManager } from 'src/database/transaction.manager';
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
import { User } from 'src/components/user/schema/user.schema';
import { IWorkspaceService } from '../../interface/workspace-service.interface';
import { WorkspaceRepository } from '../../repository/workspace.repository';
import { WorkspaceService } from '../workspace.service';
import { UserRepository } from 'src/components/user/repository/user.repository';
import { WorkspaceRepository2 } from '../../repository/workspace.repository2';
import { WorkspaceMemberRepository } from '../../repository/workspace.member.repository';
import { ChannelRepository } from 'src/components/channel/repository/channel.repository';
import { ChannelMemberRepository } from 'src/components/channel/repository/channel.member.repository';
import { SlackBaseRepository } from 'src/database/base.repository';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';

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
  let service: IWorkspaceService;
  let workspaceRepository: WorkspaceRepository;

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
    workspaceRepository = new WorkspaceRepository(txManager);
    const workspaceRepository2 = new WorkspaceRepository2(txManager);
    const workspaceMemberRepository = new WorkspaceMemberRepository(txManager);
    const channelRepository = new ChannelRepository(txManager);
    const channelMemberRepository = new ChannelMemberRepository(txManager);
    service = new WorkspaceService(
      userRepository,
      workspaceRepository,
      workspaceRepository2,
      workspaceMemberRepository,
      channelRepository,
      channelMemberRepository,
    );
  });

  //   beforeAll(async () => {
  //     container = await new MySqlContainer().start();
  //     const options: TypeOrmModuleOptions = {
  //       type: 'mysql',
  //       host: container.getHost(),
  //       port: container.getPort(),
  //       database: container.getDatabase(),
  //       username: container.getUsername(),
  //       password: container.getUserPassword(),
  //       synchronize: true,
  //       entities: [
  //         User,
  //         Workspace,
  //         WorkspaceMember,
  //         Channel,
  //         DM,
  //         Mention,
  //         ChannelMember,
  //         ChannelChat,
  //       ],
  //     };

  //     const moduleRef = await Test.createTestingModule({
  //       imports: [TypeOrmModule.forRoot(options)],
  //       providers: [
  //         UserRepository,
  //         // SlackBaseRepository를 MockSlackBaseRepository로 대체
  //         {
  //           provide: SlackBaseRepository,
  //           useClass: SlackBaseRepository,
  //           de,
  //         },
  //       ],
  //     }).compile();
  //   });

  beforeEach(() => {
    namespace = createNamespace(SLACK_NAMESPACE);
  });

  afterEach(async () => {
    await dataSource.query('DELETE FROM workspaces;');
    await dataSource.query('ALTER TABLE workspaces AUTO_INCREMENT = 1;');
    await dataSource.query('ALTER TABLE workspacemembers AUTO_INCREMENT = 1;');
    await dataSource.query('ALTER TABLE channels AUTO_INCREMENT = 1;');
    await dataSource.query('ALTER TABLE channelMembers AUTO_INCREMENT = 1;');
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
