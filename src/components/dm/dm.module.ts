import { ClassProvider, Module } from '@nestjs/common';
import { DmController } from './dm.controller';
import { DmService } from './dm.service';
import { DMServiceKey } from './interface/dm-service.interface';
import { DMRepositoryKey } from './interface/dm-repository.interface';
import { DMRepository } from './repository/dm.repository';

const dmService: ClassProvider = {
  provide: DMServiceKey,
  useClass: DmService,
};

export const dmRepository: ClassProvider = {
  provide: DMRepositoryKey,
  useClass: DMRepository,
};

@Module({
  imports: [],
  controllers: [DmController],
  providers: [dmService, dmRepository],
})
export class DmModule {}
