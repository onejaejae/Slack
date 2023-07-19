import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { createNamespace, getNamespace } from 'cls-hooked';
import { NextFunction, Request, Response } from 'express';
import { EntityManager } from 'typeorm';
import { SLACK_NAMESPACE, SLACK_ENTITY_MANAGER } from './namespace.constant';

/**
 * TransactionMiddleware
 *
 * @description Http Request가 들어올 때 DatabaseModule에서 설정한 TypeOrm에서 em을 주입받아
 * 각 요청의 Context에서만 접근할 수 있는 em 인스턴스를 setting 해준다.
 *
 * @summary 요청 -> Namespace 생성 혹은 가져오기 -> Context에 em setting
 */
@Injectable()
export class TransactionMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger(TransactionMiddleware.name);
  constructor(private readonly em: EntityManager) {}
  use(_req: Request, _res: Response, next: NextFunction) {
    const namespace =
      getNamespace(SLACK_NAMESPACE) ?? createNamespace(SLACK_NAMESPACE);
    this.logger.log(`Hit TransactionMiddleware`);

    return namespace.runAndReturn(async () => {
      this.logger.log(`SLACK_NAMESPACE Run with status: ${!!namespace.active}`);
      Promise.resolve()
        .then(() => this.setEntityManager())
        .then(next);
    });
  }

  private setEntityManager() {
    const namespace = getNamespace(SLACK_NAMESPACE)!;
    namespace.set(SLACK_ENTITY_MANAGER, this.em);
  }
}
