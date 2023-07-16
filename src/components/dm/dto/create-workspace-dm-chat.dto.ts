import { IsString } from 'class-validator';

export class CreateWorkspaceDmChatDto {
  @IsString()
  content: string;
}
