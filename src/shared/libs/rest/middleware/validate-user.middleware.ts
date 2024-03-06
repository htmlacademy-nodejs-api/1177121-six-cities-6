import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';
import {IOfferService} from '../../../modules/offer/index.js';


export class ValidateUserMiddleware implements IMiddleware {
  constructor(
    private readonly offerService: IOfferService,
    private readonly entityName: string,
    private readonly paramName: string,
  ) {}

  public async execute({ params, tokenPayload}: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = params[this.paramName];

    if (!(await this.offerService.isAuthor(tokenPayload.id, documentId))) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `Action is forbidden for ${this.entityName}`,
        'ValidateAuthorMiddleware',
      );
    }

    next();
  }
}
