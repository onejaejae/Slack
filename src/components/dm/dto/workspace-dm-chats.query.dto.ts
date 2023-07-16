import { IsNumber } from 'class-validator';

export class WorkspaceDmChatsQueryDto {
  @IsNumber()
  perPage: number;

  @IsNumber()
  page: number;
}
