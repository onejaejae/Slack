import { TypeORMException } from 'src/common/exceptions/typeorm.exception';
import { TypeORMExceptionFilter } from '../typeorm-exception.filter';
import { TypeORMError } from 'typeorm';
import { ArgumentsHost, HttpStatus } from '@nestjs/common';

describe('TypeORMExceptionFilter', () => {
  let filter: TypeORMExceptionFilter;

  beforeAll(() => {
    filter = new TypeORMExceptionFilter();
  });

  it('should catch and handle TypeORMException', () => {
    // given
    const err = new TypeORMError('Test Error');
    const exception = new TypeORMException('Test Exception', 'Test Class', err);
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const host: ArgumentsHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
      }),
    } as unknown as ArgumentsHost;

    // when
    filter.catch(exception, host);

    // then
    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      callClass: exception.callClass,
      callMethod: exception.callMethod,
      message: exception.message,
      stack: exception.stack,
    });
  });
});
