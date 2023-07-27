import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { TypeORMException } from '../exceptions/typeorm.exception';

@Catch(TypeORMException)
export class TypeORMExceptionFilter implements ExceptionFilter {
  catch(exception: TypeORMException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let responseStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    const responseJson: Record<string, any> = {
      callClass: exception.callClass,
      callMethod: exception.callMethod,
      message: exception.message,
    };

    if (process.env.NODE_ENV !== 'production') {
      responseJson.stack = exception.stack;
    }

    console.log('responseJson', responseJson);

    return response.status(responseStatus).json(responseJson);
  }
}
