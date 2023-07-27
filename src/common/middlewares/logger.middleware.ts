import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { SlackConfigService } from 'src/components/config/config.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  constructor(private readonly configService: SlackConfigService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const appConfig = this.configService.getAppConfig();
    // router 시작 전 실행
    // 순서 1
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    const contenLength = res.get('content-length');

    if (appConfig.ENV !== 'production')
      this.logger.log(
        `${method} ${originalUrl} ${contenLength} - ${userAgent} ${ip}`,
      );

    // 순서 2
    next();
  }
}
