import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class DmUnreadQueryDto {
  @IsNumber()
  @Type(() => Number)
  after: number;
}
