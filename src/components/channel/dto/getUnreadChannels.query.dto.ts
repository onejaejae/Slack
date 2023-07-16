import { IsNumber } from 'class-validator';

export class GetUnreadChannelsQueryDto {
  @IsNumber()
  after: number;
}
