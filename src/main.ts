declare const module: any;

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
import { Options } from 'express-mysql-session';
const MySQLStore = require('express-mysql-session')(session);

(async function () {
  const app = await NestFactory.create<NestExpressApplication>(Modules);
  const configService = app.get(SlackConfigService);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  const appConfig = configService.getAppConfig();
  const authConfig = configService.getAuthConfig();

  const options: Options = {
    host: 'localhost',
    port: 3306,
    user: 'slack',
    password: '1234',
    database: 'slack',
    createDatabaseTable: true,
  };

  app.use(helmet());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ApiResponseInterceptor());
  app.useGlobalFilters(new TypeORMExceptionFilter());
  app.use(cookieParser());
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      proxy: true,
      rolling: true,
      secret: authConfig.COOKIE_SECRET,
      cookie: {
        httpOnly: true,
        maxAge: parseInt(process.env.SESSION_EXPIRE || '86400000', 10),
        secure: 'auto',
        sameSite: 'none',
      },
      store: new MySQLStore(options),
    }),
  );

  await app.listen(appConfig.PORT);
  Logger.log(`🐁 [SLACK-API][${appConfig.ENV}] Started at: ${Date.now()}`);
  Logger.log(`🚀 Server open at ${appConfig.BASE_URL}:${appConfig.PORT}`);
})();
