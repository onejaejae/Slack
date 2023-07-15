import { IsString } from 'class-validator';

export class JoinDto {
  @IsString()
  email: string;

  @IsString()
  nickname: string;

  @IsString()
  password: string;
}
