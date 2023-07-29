import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TypeORMError } from 'typeorm';
import { TypeORMException } from '../exceptions/typeorm.exception';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  private logger = new Logger('HTTP');

  constructor() {}

  private propagateException(err: any, returnObj: Record<string, any>) {
    const { callClass, callMethod } = returnObj;

    switch (true) {
      case err instanceof TypeORMError:
        throw new TypeORMException(callClass, callMethod, err);

      default:
        break;
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        const returnObj: Record<string, any> = {
          message: err.message,
        };

        if (process.env.NODE_ENV !== 'production') {
          returnObj.callClass = context.getClass().name;
          returnObj.callMethod = context.getHandler().name;
          returnObj.stack = err.stack;
        }

        if (err instanceof HttpException) {
          const payload = err.getResponse();
          context.switchToHttp().getResponse().status(err.getStatus());

          this.logger.error(
            `${context.getClass().name}.${context.getHandler().name}`,
            err,
          );

          return of({
            ...returnObj,
            ...(typeof payload === 'string' ? { message: payload } : payload),
          });
        }

        if (process.env.NODE_ENV === 'production') {
          //TODO send message via Webhook
        }

        context
          .switchToHttp()
          .getResponse()
          .status(HttpStatus.INTERNAL_SERVER_ERROR);

        this.propagateException(err, returnObj); // propagate error for exception filters

        this.logger.error(
          `${context.getClass().name}.${context.getHandler().name}`,
          err,
        );
        return of(returnObj);
      }),
    );
  }
}
