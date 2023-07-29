import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { ChannelModule } from '../channel/channel.module';

@Module({
  imports: [UserModule, WorkspaceModule, ChannelModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
