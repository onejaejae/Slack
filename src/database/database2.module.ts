import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlackConfigModule } from 'src/components/config/config.module';
import { SlackConfigService } from 'src/components/config/config.service';
import { Channel } from '../components/channel/schema/channel.schema';
import { DM } from '../components/dm/schema/dm.schema';
import { ChannelChat } from '../components/channel/schema/channel.chat.schema';
import { ChannelMember } from '../components/channel/schema/channel.member.schema';
import { WorkspaceMember } from '../components/workspace/schema/workspace.member.schema';
import { Mention } from '../components/mention/schema/mention.schema';
import { User } from '../components/user/schema/user.schema';
import { Workspace } from '../components/workspace/schema/workspace.schema';
import { TransactionManager } from './transaction.manager';
import { TransactionMiddleware } from 'src/common/middlewares/transaction.middleware';
import {
  DiscoveryModule,
  DiscoveryService,
  MetadataScanner,
  Reflector,
} from '@nestjs/core';
import {
  BaseRepository,
  TRANSACTIONAL_KEY,
} from 'src/common/decorators/transactional.decorator2';
import { DataSource, QueryRunner } from 'typeorm';
import { AsyncLocalStorage } from 'async_hooks';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [SlackConfigModule],
      inject: [SlackConfigService],
      useFactory: async (slackConfigService: SlackConfigService) => {
        const dbConfig = slackConfigService.getDBConfig();

        return {
          type: 'mysql',
          host: 'localhost',
          port: Number(dbConfig.DB_PORT),
          username: dbConfig.DB_USER_NAME,
          password: dbConfig.DB_PASSWORD,
          database: dbConfig.DB_DATABASE,
          entities: [
            Channel,
            Workspace,
            User,
            DM,
            ChannelChat,
            ChannelMember,
            WorkspaceMember,
            Mention,
          ],
          synchronize: false,
          logging: true,
          charset: 'utf8mb4',
        };
      },
    }),
    DiscoveryModule,
  ],
  providers: [TransactionManager],
  exports: [TransactionManager],
})
export class DatabaseModule2 implements NestModule, OnModuleInit {
  private readonly queryRunnerLocalStorage = new AsyncLocalStorage<{
    queryRunner: QueryRunner;
  }>();

  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule2,
      global: true,
    };
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TransactionMiddleware).forRoutes('*');
  }

  constructor(
    private readonly discover: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
  ) {}

  onModuleInit() {
    this.transactionalWrap();
    this.repositoryWrap();
  }

  transactionalWrap() {
    const instances = this.discover
      .getProviders()
      .filter((v) => v.isDependencyTreeStatic())
      .filter(({ metatype, instance }) => {
        if (!instance || !metatype) return false;
        else return true;
      });

    for (const instance of instances) {
      const names = this.metadataScanner.getAllMethodNames(
        Object.getPrototypeOf(instance.instance),
      );

      for (const name of names) {
        const originalMethod = instance.instance[name];

        const isTransactional = this.reflector.get(
          TRANSACTIONAL_KEY,
          originalMethod,
        );

        if (!isTransactional) {
          continue;
        }

        instance.instance[name] = this.wrapMethod(
          originalMethod,
          instance.instance,
        );
      }
    }
  }

  repositoryWrap() {
    const { queryRunnerLocalStorage } = this;

    this.discover
      .getProviders()
      .filter((v) => v.isDependencyTreeStatic())
      .filter(({ metatype, instance }) => {
        if (!instance || !metatype) return false;
        else return true;
      })
      .filter(({ instance }) => instance instanceof BaseRepository)
      .forEach(({ instance }) => {
        Object.defineProperty(instance, 'manager', {
          configurable: false,
          get() {
            const store = queryRunnerLocalStorage.getStore();
            return store?.queryRunner.manager;
          },
        });
      });
  }

  wrapMethod(originalMethod: any, instance: any) {
    const { dataSource, queryRunnerLocalStorage } = this;

    return async function (...args: any[]) {
      const store = queryRunnerLocalStorage.getStore();

      if (store !== undefined)
        return await originalMethod.apply(instance, args);

      const queryRunner = dataSource.createQueryRunner();
      await queryRunner.startTransaction();

      const result = await queryRunnerLocalStorage.run(
        { queryRunner },
        async () => {
          try {
            const result = await originalMethod.apply(instance, args);
            await queryRunner.commitTransaction();
            return result;
          } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
          } finally {
            await queryRunner.release();
          }
        },
      );

      return result;
    };
  }
}
