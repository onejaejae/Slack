import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  Logger,
  Inject,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TypeORMError } from 'typeorm';
import { TypeORMException } from '../exceptions/typeorm.exception';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { SlackConfigService } from 'src/components/config/config.service';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  private curryLogger(tag: string) {
    return (data: any) => this.logger.error(tag, data);
  }
  private NODE_ENV;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly configService: SlackConfigService,
  ) {
    this.NODE_ENV = configService.getAppConfig().ENV;
  }

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
    const logError = this.curryLogger(
      `${context.getClass().name}.${context.getHandler().name}`,
    );

    return next.handle().pipe(
      catchError((err) => {
        const returnObj: Record<string, any> = {
          message: err.message,
        };

        if (this.NODE_ENV !== 'production') {
          returnObj.callClass = context.getClass().name;
          returnObj.callMethod = context.getHandler().name;
          returnObj.stack = err.stack;
        }

        if (err instanceof HttpException) {
          const payload = err.getResponse();
          context.switchToHttp().getResponse().status(err.getStatus());

          if (this.NODE_ENV !== 'production') {
            logError(err);
          }

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

        logError(err);
        this.propagateException(err, returnObj); // propagate error for exception filters

        return of(returnObj);
      }),
    );
  }
}
