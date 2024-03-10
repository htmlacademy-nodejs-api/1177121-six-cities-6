import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  BaseController,
  DocumentExistsMiddleware,
  EHttpMethod,
  HttpError,
  PrivateRouteMiddleware,
  TRequestBody,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
  ValidateUserMiddleware,
} from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { ILogger } from '../../libs/logger/logger.interface.js';
import {
  capitalizeFirstLetter,
  checkCity,
  fillDTO,
  getNumberOrUndefined,
} from '../../helpers/index.js';
import { offerConstants } from '../../constants/index.js';
import { CommentRdo, ICommentService } from '../comment/index.js';
import {
  TCreateOfferRequest,
  TUpdateOfferRequest,
  TOfferRequest,
  TParamOfferId,
  TParamCity,
} from './types/index.js';
import { CreateOfferDto, UpdateOfferDto } from './dto/index.js';
import { OfferPreviewRdo, OfferRdo } from './rdo/index.js';
import { DefaultOfferService } from './default-offer.service.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: ILogger,
    @inject(Component.OfferService)
    private readonly offerService: DefaultOfferService,
    @inject(Component.CommentService)
    private readonly commentService: ICommentService
  ) {
    super(logger);

    this.logger.info('Register router for OfferController…');
    this.addRoute({
      path: offerConstants.Path.Index,
      method: EHttpMethod.Get,
      handler: this.index,
    });
    this.addRoute({
      path: offerConstants.Path.Premium,
      method: EHttpMethod.Get,
      handler: this.showPremium,
    });
    this.addRoute({
      path: offerConstants.Path.Favorites,
      method: EHttpMethod.Get,
      handler: this.showFavorites,
      middlewares: [new PrivateRouteMiddleware()],
    });
    this.addRoute({
      path: offerConstants.Path.Create,
      method: EHttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto),
      ],
    });
    this.addRoute({
      path: offerConstants.Path.Update,
      method: EHttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new ValidateUserMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: offerConstants.Path.Delete,
      method: EHttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new ValidateUserMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: offerConstants.Path.toggleFavorites,
      method: EHttpMethod.Patch,
      handler: this.updateFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: offerConstants.Path.Show,
      method: EHttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: offerConstants.Path.Comments,
      method: EHttpMethod.Get,
      handler: this.showComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
  }

  public async create(
    { body, tokenPayload }: TCreateOfferRequest,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.create({
      ...body,
      userId: tokenPayload.id,
    });

    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async update(
    { body, params: { offerId } }: TUpdateOfferRequest,
    res: Response
  ): Promise<void> {
    const updateOffer = await this.offerService.updateById(offerId, body);

    this.ok(res, fillDTO(OfferRdo, updateOffer));
  }

  public async delete(
    { params: { offerId } }: Request<TParamOfferId>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.deleteById(offerId);

    await this.commentService.deleteByOfferId(offerId);

    this.noContent(res, offer);
  }

  public async index(
    { query: { limit } }: TOfferRequest,
    res: Response
  ): Promise<void> {
    const count = getNumberOrUndefined(limit);
    const offers = await this.offerService.find(count);

    this.ok(res, fillDTO(OfferPreviewRdo, offers));
  }

  public async show(
    { params: { offerId } }: Request<TParamOfferId>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.findById(offerId);

    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async showPremium(
    { params: { city } }: Request<TParamCity>,
    res: Response
  ): Promise<void> {
    const existsCity = checkCity(city);

    if (!existsCity) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `The specified city «${capitalizeFirstLetter(city)}» is not found.`,
        'OfferController'
      );
    }

    const premiumOffers = await this.offerService.findPremium(existsCity);

    this.ok(res, fillDTO(OfferPreviewRdo, premiumOffers));
  }

  public async showFavorites(
    { tokenPayload: { id } }: Request,
    res: Response
  ): Promise<void> {
    const offers = await this.offerService.findFavorites(id);

    this.ok(res, fillDTO(OfferPreviewRdo, offers));
  }

  public async updateFavorite(
    {
      params: { offerId },
      tokenPayload: { id },
      body,
    }: Request<TParamOfferId, TRequestBody, { isFavorite: string }>,
    res: Response
  ): Promise<void> {
    const isFavorite: boolean = JSON.parse(body.isFavorite);
    const userId = id;

    const offer = await this.offerService.toggleFavorite(
      userId,
      offerId,
      isFavorite
    );

    this.ok(res, {
      favorites: offer,
    });
  }

  public async showComments(
    { params: { offerId }, query: { limit } }: Request<TParamOfferId>,
    res: Response
  ): Promise<void> {
    const count = getNumberOrUndefined(limit);
    const comments = await this.commentService.findByOfferId(offerId, count);

    this.ok(res, fillDTO(CommentRdo, comments));
  }
}
