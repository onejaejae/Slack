import { ClassProvider, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { ChannelModule } from '../channel/channel.module';
import { AuthServiceKey } from './interface/auth-service.interface';

const authService: ClassProvider = {
  provide: AuthServiceKey,
  useClass: AuthService,
};
@Module({
  imports: [UserModule, WorkspaceModule, ChannelModule],
  controllers: [AuthController],
  providers: [authService],
})
export class AuthModule {}
