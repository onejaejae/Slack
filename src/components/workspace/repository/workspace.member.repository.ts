import { Injectable } from '@nestjs/common';
import { WorkspaceMember } from 'src/components/mapping/schema/workspace.member.schema';
import { SlackBaseRepository } from 'src/database/base.repository';
import {
  DataSource,
  EntityTarget,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

@Injectable()
export class WorkspaceMemberRepository extends SlackBaseRepository<WorkspaceMember> {
  getName(): EntityTarget<WorkspaceMember> {
    return WorkspaceMember.name;
  }
}
