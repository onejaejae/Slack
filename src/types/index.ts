import { VerifiedUser } from './user/common';
import { Request as ExpressRequest } from 'express';

export interface BaseSchema {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

declare module 'express-session' {
  interface SessionData {
    credentials: VerifiedUser;
  }
}
export type Request = ExpressRequest;
