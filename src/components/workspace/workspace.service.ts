import { Injectable } from '@nestjs/common';
import { WorkspaceRepository } from './repository/workspace.repository';
import { Transactional } from 'src/common/decorators/transactional.decorator';

@Injectable()
export class WorkspaceService {
  constructor(private readonly workspaceRepository: WorkspaceRepository) {}

  @Transactional()
  async getMyWorkspaces(userId: number) {
    console.log('getMyWorkspaces service');

    return this.workspaceRepository.findMyWorkspaces(userId);
  }
}
