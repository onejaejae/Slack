import { NestFactory } from '@nestjs/core';
import { Modules } from './module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SlackConfigService } from './components/config/config.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { TypeORMExceptionFilter } from './common/filters/typeorm-exception.filter';
import { ApiResponseInterceptor } from './common/interceptors/apiResponse.interceptor';
import helmet from 'helmet';

(async function () {
  const app = await NestFactory.create<NestExpressApplication>(Modules);
  const configService = app.get(SlackConfigService);

  app.enableCors({
    origin: ['http://localhost:3090'],
    credentials: true,
  });
  const appConfig = configService.getAppConfig();
  const ServerConfig = configService.getServer();

  app.use(helmet());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ApiResponseInterceptor());
  app.useGlobalFilters(new TypeORMExceptionFilter());
  app.use(cookieParser());
  app.use(session(ServerConfig.SESSION));

  await app.listen(appConfig.PORT);
  Logger.log(`🐁 [SLACK-API][${appConfig.ENV}] Started at: ${Date.now()}`);
  Logger.log(`🚀 Server open at ${appConfig.BASE_URL}:${appConfig.PORT}`);
})();
