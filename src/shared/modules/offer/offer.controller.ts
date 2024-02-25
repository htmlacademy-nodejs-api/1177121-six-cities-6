import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController, EHttpMethod, HttpError } from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { ILogger } from '../../libs/logger/logger.interface.js';
import { capitalizeFirstLetter, checkCity, checkString, fillDTO } from '../../helpers/index.js';
import { DefaultOfferService } from './default-offer.service.js';
import { CreateOfferRequest } from './types/create-offer-request.type.js';
import { TUpdateOfferRequest } from './types/update-offer-request.type.js';
import { OfferRdo } from './rdo/offer.rdo.js';

@injectable()
export class OfferController extends BaseController{
  constructor(
    @inject(Component.Logger) protected readonly logger: ILogger,
    @inject(Component.OfferService) private readonly offerService: DefaultOfferService,
  ){
    super(logger);

    this.logger.info('Register router for OfferController...');
    this.addRoute({path: '/', method:EHttpMethod.Post, handler: this.create});
    this.addRoute({path: '/:offerId', method: EHttpMethod.Put, handler: this.updateById});
    this.addRoute({path: '/:offerId', method: EHttpMethod.Delete, handler: this.deleteById});
    this.addRoute({path:'/', method: EHttpMethod.Get, handler: this.index});
    this.addRoute({path: '/:offerId', method:EHttpMethod.Get, handler: this.findById});
    this.addRoute({path: '/premium/:city', method:EHttpMethod.Get, handler: this.findPremium});
    this.addRoute({path: '/favorites', method:EHttpMethod.Get, handler: this.findFavorites});
    this.addRoute({path: '/:offerId/favorite', method:EHttpMethod.Get, handler: this.updateFavorite});
  }

  public async create(
    { body }: CreateOfferRequest,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.create(body);
    console.log(offer);

    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async updateById({ body, params }: TUpdateOfferRequest, res: Response): Promise<void> {
    const offerId = checkString(params.offerId);

    if (!offerId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `The specified id ${params.offerId} is not valid`,
        'OfferController'
      );
    }

    const offer = this.offerService.updateById(offerId, body);
    const responseData = fillDTO(OfferRdo, offer);

    this.ok(res, responseData);
  }

  public async deleteById({params}: Request, res: Response): Promise<void> {
    const existsOffer = await this.offerService.deleteById(params.offerId);

    if (!existsOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with the specified id «${params.offerId}» is not found.`,
        'OfferController',
      );
    }

    this.noContent(res, existsOffer);
  }


  public async index({ params }: Request, res: Response): Promise<void> {
    const count = params.limit && Number.parseFloat(params.limit);
    const offers = await this.offerService.find(count as number);
    const responseData = fillDTO(OfferRdo, offers);

    this.ok(res, responseData);
  }

  public async findById({ params }: Request, res: Response):Promise<void>{
    const existsOffer = await this. offerService.findById(params.offerId);

    if (!existsOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with the specified id «${params.offerId}» is not found.`,
        'OfferController',
      );
    }

    this.ok(res, fillDTO(OfferRdo, existsOffer));
  }

  public async findPremium({ params }: Request, res: Response):Promise<void>{
    const city = checkCity(params.city);

    if (!city) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `The specified city «${capitalizeFirstLetter(params.city)}» is not found.`,
        'OfferController',
      );
    }

    const premiumOffers = await this.offerService.findPremium(city);

    this.ok(res, fillDTO(OfferRdo, premiumOffers));
  }


  public async findFavorites(_req: Request, _res: Response):Promise<void>{
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'OfferController'
    );
  }

  public async updateFavorite(_req: Request, _res: Response):Promise<void>{
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'OfferController'
    );
  }
}
