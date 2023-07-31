import { Injectable } from '@nestjs/common';
import { IDMService } from './interface/dm-service.interface';

@Injectable()
export class DmService implements IDMService {
  constructor() {}

  getWorkspaceDMs(url: string, userId: number) {
    throw new Error('Method not implemented.');
  }
  getWorkspaceDMChats(
    url: string,
    id: number,
    userId: number,
    perPage: number,
    page: number,
  ) {
    throw new Error('Method not implemented.');
  }
  createWorkspaceDMChats(
    url: string,
    content: string,
    id: number,
    userId: number,
  ) {
    throw new Error('Method not implemented.');
  }
  createWorkspaceDMImages(
    url: string,
    files: Express.Multer.File[],
    id: number,
    userId: number,
  ) {
    throw new Error('Method not implemented.');
  }
  getDMUnreadsCount(
    url: string,
    senderId: number,
    receiverId: number,
    after: number,
  ) {
    throw new Error('Method not implemented.');
  }
}
