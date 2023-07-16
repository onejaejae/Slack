import { IsString } from 'class-validator';

export class CreateWorkspaceMembersDto {
  @IsString()
  email: string;
}
