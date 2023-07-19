import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repository/user.repository';
import { WorkspaceModule } from '../workspace/workspace.module';
import { ChannelModule } from '../channel/channel.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [WorkspaceModule, ChannelModule, DatabaseModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
