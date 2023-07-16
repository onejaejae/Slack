import { IsString } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  workspace: string;
  @IsString()
  url: string;
}
