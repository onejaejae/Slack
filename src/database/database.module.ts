import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
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
  ],
  providers: [TransactionManager],
  exports: [TransactionManager],
})
export class DatabaseModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TransactionMiddleware).forRoutes('*');
  }

  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      global: true,
    };
  }
}
