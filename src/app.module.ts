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

@Module({
  imports: [
    SlackConfigModule,
    UserModule,
    WorkspaceModule,
    ChannelModule,
    AuthModule,
    DmModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
