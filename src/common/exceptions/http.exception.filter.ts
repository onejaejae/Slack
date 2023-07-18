import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response: Response = context.getResponse();
    const status = exception.getStatus();

    const err = exception.getResponse() as
      | string
      | { error: string; statusCode: number; message: string[] };

    response.status(status).json({ msg: err });
  }
}
