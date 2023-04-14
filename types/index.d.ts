import { Request, Response, NextFunction } from 'express';

interface IReqInfo extends Request {
  userInfo?: {
    _id: string;
  };
}

declare type RequestWithInfo = IReqInfo;
