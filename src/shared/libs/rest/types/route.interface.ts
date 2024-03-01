import { NextFunction, Request, Response } from 'express';
import { IMiddleware } from '../middleware/index.js';
import { EHttpMethod } from './http-method.enum.js';

export interface IRoute {
  path: string;
  method: EHttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: IMiddleware[];
}
