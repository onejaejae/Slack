import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ErrorInterceptor } from '../error.interceptor';
import { SlackConfigService } from 'src/components/config/config.service';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { createMock } from '@golevelup/ts-jest';
import { lastValueFrom, throwError } from 'rxjs';
import { TypeORMError } from 'typeorm';
import { TypeORMException } from 'src/common/exceptions/typeorm.exception';

describe('ErrorInterceptor', () => {
  let interceptor: ErrorInterceptor;
  let context: ExecutionContext;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ErrorInterceptor,
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: {
            error: jest.fn(),
          },
        },
        {
          provide: SlackConfigService,
          useValue: {
            getAppConfig: jest.fn(() => ({ ENV: 'test' })),
          },
        },
      ],
    }).compile();

    interceptor = module.get<ErrorInterceptor>(ErrorInterceptor);
    context = createMock<ExecutionContext>();
  });

  it('Should be defined', () => {
    //given
    //when
    //then
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('should handle HttpException and return response object', async () => {
      // given
      const message = 'Test Error';
      const next: CallHandler = {
        handle: () => {
          return throwError(
            () => new HttpException(message, HttpStatus.BAD_REQUEST),
          );
        },
      };

      // when
      const resultObservable = interceptor.intercept(context, next);

      // then
      const res = await lastValueFrom(resultObservable);
      expect(res.message).toBe(message);
      expect(res).toHaveProperty('callClass');
      expect(res).toHaveProperty('callMethod');
      expect(res).toHaveProperty('stack');
    });

    it('should handle TypeORMError and propagate exception', async () => {
      // given
      const message = 'Test TypeORM Error';
      const next: CallHandler = {
        handle: () => {
          return throwError(() => new TypeORMError(message));
        },
      };

      // when
      try {
        await lastValueFrom(interceptor.intercept(context, next));
      } catch (error) {
        // then
        expect(error).toBeInstanceOf(TypeORMException);
      }
    });
  });
});
