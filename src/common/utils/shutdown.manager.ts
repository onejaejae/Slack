import {
  Inject,
  Injectable,
  Logger,
  OnApplicationShutdown,
} from '@nestjs/common';
import { destroyNamespace, getNamespace } from 'cls-hooked';
import { DataSource } from 'typeorm';
import { SLACK_NAMESPACE } from '../middlewares/namespace.constant';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

/**
 * for NestJS Server Graceful ShutDown
 *
 * @description NestJS Application이 종료가 되었을 때 현재 사용하고 있는 리소스를 종료시켜야 한다.
 * 현재 사용중인 리소스 목록은 NameSpace, PG있다.
 */
@Injectable()
export class ShutDownManager implements OnApplicationShutdown {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly dataSource: DataSource,
  ) {}

  async onApplicationShutdown(signal: string) {
    this.logger.debug(`Start Shut Down Graceful with ${signal}`);
    await Promise.resolve().then(async () => {
      this.logger.debug('Try Resources Close...');

      // namespace
      if (getNamespace(SLACK_NAMESPACE)) {
        destroyNamespace(SLACK_NAMESPACE);
        this.logger.debug('Destroyed NameSpace :)');
      }

      // database
      if (this.dataSource.isInitialized) {
        this.dataSource.destroy();
        this.logger.debug('Destroyed DataSource :)');
      }
      this.logger.debug('Finish Resources Close...');
    });
  }
}
