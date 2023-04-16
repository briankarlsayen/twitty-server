import { Request, Response, NextFunction } from 'express';

declare global {
  interface Date {
    addMinutes(min: number, useThis?: boolean): Date;
  }
}

interface IReqInfo extends Request {
  userInfo?: {
    _id: string;
  };
}

declare type RequestWithInfo = IReqInfo;
