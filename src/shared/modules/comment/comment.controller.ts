import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  BaseController,
  HttpError,
  EHttpMethod,
} from '../../libs/rest/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { IOfferService } from '../offer/index.js';
import { fillDTO } from '../../helpers/index.js';
import { ICommentService } from './comment-service.interface.js';
import { CommentRdo } from './rdo/comment.rdo.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: ILogger,
    @inject(Component.CommentService) private readonly commentService: ICommentService,
    @inject(Component.OfferService) private readonly offerService: IOfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentsController...');

    this.addRoute({ path: '/', method: EHttpMethod.Post, handler: this.create });
  }

  public async create({ body } : Request, res: Response): Promise<void> {
    const offerId = body.offerId;

    if (! await this.offerService.exists(offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with the specified id ${offerId} not found.`,
        'CommentController'
      );
    }

    const comment = this.commentService.create(body);

    await this.offerService.incCommentCount(offerId);
    this.created(res, fillDTO(CommentRdo, comment));
  }
}
