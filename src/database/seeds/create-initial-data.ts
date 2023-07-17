import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Workspace } from '../../components/workspace/schema/workspace.schema';
import { Channel } from '../../components/channel/schema/channel.schema';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const workspacesRepository = dataSource.getRepository(Workspace);
    await workspacesRepository.insert([
      {
        id: 1,
        name: 'Sleact',
        url: 'sleact',
      },
    ]);
    const channelsRepository = dataSource.getRepository(Channel);
    await channelsRepository.insert([
      {
        id: 1,
        name: '일반',
        workspaceId: 1,
        private: false,
      },
    ]);
  }
}
