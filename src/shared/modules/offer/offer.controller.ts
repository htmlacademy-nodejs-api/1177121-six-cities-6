import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  BaseController,
  DocumentExistsMiddleware,
  EHttpMethod,
  HttpError,
  PrivateRouteMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware
} from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { ILogger } from '../../libs/logger/logger.interface.js';
import {
  capitalizeFirstLetter,
  checkCity,
  fillDTO,
  getNumberOrUndefined,
} from '../../helpers/index.js';
import { CommentRdo, ICommentService } from '../comment/index.js';
import {
  TCreateOfferRequest,
  TUpdateOfferRequest,
  TOfferRequest,
  TParamOfferId,
  TParamCity,
} from './types/index.js';
import { CreateOfferDto, UpdateOfferDto } from './dto/index.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { DefaultOfferService } from './default-offer.service.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: ILogger,
    @inject(Component.OfferService) private readonly offerService: DefaultOfferService,
    @inject(Component.CommentService) private readonly commentService: ICommentService
  ) {
    super(logger);

    this.logger.info('Register router for OfferController…');
    this.addRoute({
      path: '/',
      method: EHttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto)
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: EHttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: EHttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: EHttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({ path: '/', method: EHttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/premium/:city', method: EHttpMethod.Get, handler: this.getPremium });
    this.addRoute({
      path: '/favorites',
      method: EHttpMethod.Get,
      handler: this.getFavorites,
      middlewares: [new PrivateRouteMiddleware()],
    });
    this.addRoute({
      path: '/:offerId/favorite',
      method: EHttpMethod.Get,
      handler: this.updateFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: EHttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
  }

  public async create({ body, tokenPayload }: TCreateOfferRequest, res: Response): Promise<void> {
    const offer = await this.offerService.create({ ...body, userId: tokenPayload.id });

    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async update({ body, params: { offerId } }: TUpdateOfferRequest, res: Response): Promise<void> {
    const updateOffer = this.offerService.updateById(offerId, body);

    const responseData = fillDTO(OfferRdo, updateOffer);

    this.ok(res, responseData);
  }

  public async delete({ params: { offerId } }: Request<TParamOfferId>, res: Response): Promise<void> {
    const existsOffer = await this.offerService.deleteById(offerId);

    await this.commentService.deleteByOfferId(offerId);

    this.noContent(res, existsOffer);
  }

  public async index({ query: { limit } }: TOfferRequest, res: Response): Promise<void> {
    const count = getNumberOrUndefined(limit);

    const offers = await this.offerService.find(count);
    const responseData = fillDTO(OfferRdo, offers);

    this.ok(res, responseData);
  }

  public async show({ params: { offerId } }: Request<TParamOfferId>, res: Response): Promise<void> {
    const existsOffer = await this.offerService.findById(offerId);

    this.ok(res, fillDTO(OfferRdo, existsOffer));
  }

  public async getPremium({ params: { city } }: Request<TParamCity>, res: Response): Promise<void> {
    const existsCity = checkCity(city);

    if (!existsCity) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `The specified city «${capitalizeFirstLetter(city)}» is not found.`,
        'OfferController',
      );
    }

    const premiumOffers = await this.offerService.findPremium(existsCity);

    this.ok(res, fillDTO(OfferRdo, premiumOffers));
  }

  public async getFavorites(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented.',
      'OfferController'
    );
  }

  public async updateFavorite(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented.',
      'OfferController'
    );
  }

  public async getComments(
    { params: { offerId }, query: { limit } }: Request<TParamOfferId>, res: Response
  ): Promise<void> {
    const count = getNumberOrUndefined(limit);
    const comments = await this.commentService.findByOfferId(offerId, count);

    this.ok(res, fillDTO(CommentRdo, comments));
  }
}
