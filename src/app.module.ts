import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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

@Module({
  imports: [
    SlackConfigModule,
    UserModule,
    WorkspaceModule,
    ChannelModule,
    AuthModule,
    DatabaseModule,
    DmModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
