import { IsString } from 'class-validator';

export class CreateWorkspaceMemberDto {
  @IsString()
  email: string;
}
