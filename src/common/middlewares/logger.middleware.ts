import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    // router 시작 전 실행
    // 순서 1
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    // router 끝나고 실행
    // 순서 3
    res.on('finish', () => {
      const { statusCode } = res;
      const contenLength = res.get('content-length');
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contenLength} - ${userAgent} ${ip}`,
      );
    });

    // 순서 2
    next();
  }
}
