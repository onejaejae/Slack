import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetWorkspaceChannelChatsQueryDto {
  @IsNumber()
  @Type(() => Number)
  perPage: number;

  @IsNumber()
  @Type(() => Number)
  page: number;
}
