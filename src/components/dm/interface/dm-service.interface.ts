export const DMServiceKey = 'DMServiceKey';

export interface IDMService {
  getWorkspaceDMs(url: string, userId: number): any;

  getWorkspaceDMChats(
    url: string,
    id: number,
    userId: number,
    perPage: number,
    page: number,
  ): any;

  createWorkspaceDMChats(
    url: string,
    content: string,
    id: number,
    userId: number,
  ): any;

  createWorkspaceDMImages(
    url: string,
    files: Express.Multer.File[],
    id: number,
    userId: number,
  ): any;

  getDMUnreadsCount(
    url: string,
    senderId: number,
    receiverId: number,
    after: number,
  ): any;
}
