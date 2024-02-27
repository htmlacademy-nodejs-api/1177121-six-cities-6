import { NextFunction, Request, Response } from 'express';
import { EHttpMethod } from './http-method.enum.js';
import { IMiddleware } from '../index.js';

export interface IRoute {
  path: string;
  method: EHttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: IMiddleware[];
}
