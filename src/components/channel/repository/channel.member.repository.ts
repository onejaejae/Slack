import { Injectable } from '@nestjs/common';
import { ChannelMember } from 'src/components/mapping/schema/channel.member.schema';
import { SlackBaseRepository } from 'src/database/repository';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class ChannelMemberRepository extends SlackBaseRepository<ChannelMember> {
  private channelMemberRepository: SelectQueryBuilder<ChannelMember>;

  constructor(private dataSource: DataSource) {
    super(ChannelMember, dataSource.createEntityManager());

    this.channelMemberRepository = this.dataSource
      .getRepository(ChannelMember)
      .createQueryBuilder('channelMember');
  }
}
