import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  BaseController,
  HttpError,
  EHttpMethod,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { IOfferService, offerTypes } from '../offer/index.js';
import { fillDTO, getNumberOrUndefined } from '../../helpers/index.js';
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
    this.addRoute({
      path: '/offerId',
      method: EHttpMethod.Get,
      handler: this.findByOfferId,
      middlewares: [ new ValidateObjectIdMiddleware('offerId')]
    });
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

    const comment = await this.commentService.create(body);

    await this.offerService.incCommentCount(offerId);
    this.created(res, fillDTO(CommentRdo, comment));
  }

  public async findByOfferId(
    { params: { offerId} , query: { limit } }: offerTypes.TOfferRequest, res: Response
  ): Promise<void> {
    const count = getNumberOrUndefined(limit);
    const comments = await this.commentService.findByOfferId(offerId, count);

    this.ok(res, fillDTO(CommentRdo, comments));
  }
}
