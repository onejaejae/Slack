import { IsString } from 'class-validator';

export class CreateWorkspaceChannelChatsDto {
  @IsString()
  content: string;
}
