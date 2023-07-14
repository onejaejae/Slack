import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SlackConfigModule } from './components/config/config.module';

@Module({
  imports: [SlackConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
