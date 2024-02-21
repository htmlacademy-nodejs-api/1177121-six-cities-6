import { NextFunction, Request, Response } from 'express';
import { EHttpMethod } from './http-method.enum.js';

export interface Route {
  path: string;
  method: EHttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => void;
}
