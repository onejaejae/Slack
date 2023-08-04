import { SetMetadata, applyDecorators } from '@nestjs/common';
import { EntityManager } from 'typeorm';

export const TRANSACTIONAL_KEY = Symbol('TRANSACTIONAL');

export function Transactional2(): MethodDecorator {
  return applyDecorators(SetMetadata(TRANSACTIONAL_KEY, true));
}

export class BaseRepository {
  get manager(): EntityManager | undefined {
    return undefined;
  }
}

export interface IGenericRepository {
  manager: EntityManager | undefined;
}
