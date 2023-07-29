import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { ChannelMember } from './src/components/channel/schema/channel.member.schema';
import { DM } from './src/components/dm/schema/dm.schema';
import { Mention } from './src/components/mention/schema/mention.schema';
import { WorkspaceMember } from './src/components/workspace/schema/workspace.member.schema';
import { Workspace } from './src/components/workspace/schema/workspace.schema';
import { User } from './src/components/user/schema/user.schema';
import { ChannelChat } from './src/components/channel/schema/channel.chat.schema';
import { Channel } from './src/components/channel/schema/channel.schema';

dotenv.config({ path: `./dotenv/.env.local` });

const dataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.USER_NAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  entities: [
    ChannelMember,
    ChannelChat,
    Channel,
    DM,
    Mention,
    User,
    WorkspaceMember,
    Workspace,
  ],
  migrations: ['./src/migrations/*.ts'],
  synchronize: false,
  logging: true,
  charset: 'utf8mb4_general_ci',
});

export default dataSource;
