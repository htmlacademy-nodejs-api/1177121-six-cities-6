import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  BaseController,
  EHttpMethod,
  HttpError,
} from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { ILogger } from '../../libs/logger/logger.interface.js';
import {
  capitalizeFirstLetter,
  checkCity,
  checkString,
  fillDTO,
  getNumberOrUndefined,
} from '../../helpers/index.js';
import { CommentRdo, ICommentService } from '../comment/index.js';
import { DefaultOfferService } from './default-offer.service.js';
import { TCreateOfferRequest } from './types/create-offer-request.type.js';
import { TUpdateOfferRequest } from './types/update-offer-request.type.js';
import { TFindOfferRequest } from './types/find-offer-request.type.js';
import { TParamOfferId } from './types/param-offerid.type.js';
import { TParamCity } from './types/param-city.type.js';
import { OfferRdo } from './rdo/offer.rdo.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: ILogger,
    @inject(Component.OfferService) private readonly offerService: DefaultOfferService,
    @inject(Component.CommentService) private readonly commentService: ICommentService
  ) {
    super(logger);

    this.logger.info('Register router for OfferController...');
    this.addRoute({ path: '/', method: EHttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/:offerId', method: EHttpMethod.Patch, handler: this.updateById });
    this.addRoute({ path: '/:offerId', method: EHttpMethod.Delete, handler: this.deleteById });
    this.addRoute({ path: '/', method: EHttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/:offerId', method: EHttpMethod.Get, handler: this.findById });
    this.addRoute({ path: '/premium/:city', method: EHttpMethod.Get, handler: this.findPremium });
    this.addRoute({ path: '/favorites', method: EHttpMethod.Get, handler: this.findFavorites });
    this.addRoute({ path: '/:offerId/favorite', method: EHttpMethod.Get, handler: this.updateFavorite });
    this.addRoute({ path: '/:offerId/comments', method: EHttpMethod.Get, handler: this.getComments });
  }

  public async create({ body }: TCreateOfferRequest, res: Response): Promise<void> {
    const offer = await this.offerService.create(body);

    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async updateById({ body, params: { offerId } }: TUpdateOfferRequest, res: Response): Promise<void> {
    const existsOfferId = checkString(offerId);

    if (!existsOfferId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `The specified id ${offerId} is not valid.`,
        'OfferController'
      );
    }

    const updateOffer = this.offerService.updateById(existsOfferId, body);

    if (!updateOffer) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `Offer with the specified id «${offerId}» is not found.`,
        'OfferController'
      );
    }

    const responseData = fillDTO(OfferRdo, updateOffer);

    this.ok(res, responseData);
  }

  public async deleteById({ params: { offerId } }: Request<TParamOfferId>, res: Response): Promise<void> {
    const existsOffer = await this.offerService.deleteById(offerId);

    if (!existsOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with the specified id «${offerId}» is not found.`,
        'OfferController',
      );
    }

    await this.commentService.deleteByOfferId(offerId);

    this.noContent(res, existsOffer);
  }

  public async index({ query: { limit } }: TFindOfferRequest, res: Response): Promise<void> {
    const count = getNumberOrUndefined(limit);

    const offers = await this.offerService.find(count);
    const responseData = fillDTO(OfferRdo, offers);

    this.ok(res, responseData);
  }

  public async findById({ params: { offerId } }: Request<TParamOfferId>, res: Response): Promise<void> {
    const existsOffer = await this.offerService.findById(offerId);

    if (!existsOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with the specified id «${offerId}» is not found.`,
        'OfferController',
      );
    }

    this.ok(res, fillDTO(OfferRdo, existsOffer));
  }

  public async findPremium({ params: { city } }: Request<TParamCity>, res: Response): Promise<void> {
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

  public async findFavorites(_req: Request, _res: Response): Promise<void> {
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

  public async getComments({ params: { offerId } }: Request<TParamOfferId>, res: Response): Promise<void> {
    if (!await this.offerService.exists(offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with the specified id «${offerId}» is not found.`,
        'OfferController'
      );
    }

    const comments = await this.commentService.findByOfferId(offerId);

    this.ok(res, fillDTO(CommentRdo, comments));
  }
}
