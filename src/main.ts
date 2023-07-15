declare const module: any;

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

import { SlackConfigService } from './components/config/config.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(SlackConfigService);
  const appConfig = configService.getAppConfig();

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(appConfig.PORT);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  console.log(`Listening port on ${appConfig.PORT}`);
}
bootstrap();
