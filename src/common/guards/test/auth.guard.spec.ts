import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '../auth.guard';
import { Request } from 'express';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeAll(() => {
    guard = new AuthGuard();
  });

  it('Should be defined', () => {
    //given
    //when
    //then
    expect(guard).toBeDefined();
  });

  it('credentials이 없는 경우', () => {
    const context: ExecutionContext = {
      switchToHttp: () => {
        return {
          getRequest: () => {
            return {
              session: {},
            } as Request;
          },
        };
      },
    } as unknown as ExecutionContext;

    //when
    const result = guard.canActivate(context);

    //then
    expect(result).toBe(false);
  });

  it('Authorization Guard', () => {
    const context: ExecutionContext = {
      switchToHttp: () => {
        return {
          getRequest: () => {
            return {
              session: {
                credentials: {
                  user: {},
                },
              },
            } as Request;
          },
        };
      },
    } as unknown as ExecutionContext;

    //when
    const result = guard.canActivate(context);

    //then
    expect(result).toBeTruthy();
  });
});
