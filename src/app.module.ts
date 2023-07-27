import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SlackConfigModule } from './components/config/config.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { UserModule } from './components/user/user.module';
import { WorkspaceModule } from './components/workspace/workspace.module';
import { ChannelModule } from './components/channel/channel.module';
import { AuthModule } from './components/auth/auth.module';
import { DmModule } from './components/dm/dm.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ApiResponseInterceptor } from './common/interceptors/apiResponse.interceptor';
import { DatabaseModule } from './database/database.module';
import { ErrorInterceptor } from './common/interceptors/error.interceptor';
import { TransactionMiddleware } from './common/middlewares/transaction.middleware';

@Module({
  imports: [
    AuthModule,
    SlackConfigModule,
    UserModule,
    WorkspaceModule,
    ChannelModule,
    DmModule,
    DatabaseModule.forRoot(),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
