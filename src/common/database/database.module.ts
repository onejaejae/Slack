import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from 'src/components/channel/schema/channel.schema';
import { SlackConfigModule } from 'src/components/config/config.module';
import { SlackConfigService } from 'src/components/config/config.service';
import { DM } from 'src/components/dm/schema/dm.schema';
import { ChannelChat } from 'src/components/mapping/schema/channel.chat.schema';
import { ChannelMember } from 'src/components/mapping/schema/channel.member.schema';
import { WorkspaceMember } from 'src/components/mapping/schema/workspace.member.schema';
import { Mention } from 'src/components/mention/schema/mention.schema';
import { User } from 'src/components/user/schema/user.schema';
import { Workspace } from 'src/components/workspace/schema/workspace.schema';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [SlackConfigModule],
      inject: [SlackConfigService],
      useFactory: async (slackConfigService: SlackConfigService) => {
        const dbConfig = slackConfigService.getDBConfig();

        return {
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: dbConfig.USER_NAME,
          password: dbConfig.PASSWORD,
          database: dbConfig.DATABASE,
          entities: [
            Channel,
            Workspace,
            User,
            DM,
            ChannelChat,
            ChannelMember,
            WorkspaceMember,
            Mention,
          ],
          synchronize: false,
          logging: true,
          charset: 'utf8mb4',
        };
      },
    }),
  ],
})
export class DatabaseModule {}
