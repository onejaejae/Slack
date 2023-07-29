import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SlackConfigModule } from './components/config/config.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { UserModule } from './components/user/user.module';
import { WorkspaceModule } from './components/workspace/workspace.module';
import { ChannelModule } from './components/channel/channel.module';
import { AuthModule } from './components/auth/auth.module';
import { DmModule } from './components/dm/dm.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { ErrorInterceptor } from './common/interceptors/error.interceptor';
import { WinstonModule } from 'nest-winston';
import { WinstonConfigService } from './common/config-services/winston-config.service';

@Module({
  imports: [
    AuthModule,
    SlackConfigModule,
    UserModule,
    WorkspaceModule,
    ChannelModule,
    DmModule,
    DatabaseModule.forRoot(),
    WinstonModule.forRootAsync({ useClass: WinstonConfigService }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
  ],
})
export class Modules implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
