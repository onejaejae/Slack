import { Injectable } from '@nestjs/common';
import { WorkspaceMember } from 'src/components/mapping/schema/workspace.member.schema';
import { SlackBaseRepository } from 'src/database/repository';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class WorkspaceMemberRepository extends SlackBaseRepository<WorkspaceMember> {
  private workspaceMemberRepository: SelectQueryBuilder<WorkspaceMember>;

  constructor(private dataSource: DataSource) {
    super(WorkspaceMember, dataSource.createEntityManager());

    this.workspaceMemberRepository = this.dataSource
      .getRepository(WorkspaceMember)
      .createQueryBuilder('workspaceMember');
  }
}
