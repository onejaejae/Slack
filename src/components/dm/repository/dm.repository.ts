import { Injectable } from '@nestjs/common';
import { SlackBaseRepository } from 'src/database/base.repository';
import { TransactionManager } from 'src/database/transaction.manager';
import { EntityTarget } from 'typeorm';
import { DM } from '../schema/dm.schema';
import { IDMRepository } from '../interface/dm-repository.interface';

@Injectable()
export class DMRepository
  extends SlackBaseRepository<DM>
  implements IDMRepository
{
  constructor(protected readonly txManager: TransactionManager) {
    super(DM);
  }

  getName(): EntityTarget<DM> {
    return DM.name;
  }
}
