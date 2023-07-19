import { Injectable } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';

@Injectable()
export class SlackBaseRepository<T> extends Repository<T> {
  constructor(private entity: EntityTarget<T>, manager: EntityManager) {
    super(entity, manager);
  }

  async createEntity(model: T): Promise<T> {
    return this.save(model);
  }
}
