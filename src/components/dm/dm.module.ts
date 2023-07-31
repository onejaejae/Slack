import { ClassProvider, Module } from '@nestjs/common';
import { DmController } from './dm.controller';
import { DmService } from './dm.service';
import { DMServiceKey } from './interface/dm-service.interface';

const dmService: ClassProvider = {
  provide: DMServiceKey,
  useClass: DmService,
};

@Module({
  imports: [],
  controllers: [DmController],
  providers: [dmService],
})
export class DmModule {}
