import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { Component, SortType } from '../../types/index.js';
import { offerConstants } from '../../constants/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { IOfferService } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
@injectable()
export class DefaultOfferService implements IOfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  private addFieldId = [
    {
      $addFields: {
        id: '$_id',
      },
    },
  ];

  private commentsLookup = [
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'offerId',
        as: 'comments',
      },
    },
    {
      $addFields: {
        rating: { $avg: '$comments.rating' },
        commentCount: { $size: '$comments' },
      },
    },
    { $unset: 'comments' },
  ];

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async updateById(
    offerId: string,
    dto: UpdateOfferDto
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate(['userId'])
      .exec();
  }

  public async deleteById(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId).exec();
  }

  public async find(count?: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? offerConstants.OfferCount.Default;

    const offers = await this.offerModel
      .aggregate([
        ...this.addFieldId,
        ...this.commentsLookup,
        { $limit: limit },
        { $sort: { createdAt: SortType.Down } },
      ])
      .exec();

    return this.offerModel.populate(offers, { path: 'userId' });
  }

  public async findById(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel.findById(offerId).populate(['userId']);

    return offer;
  }

  public async findPremium(city: string): Promise<DocumentType<OfferEntity>[]> {
    return await this.offerModel
      .aggregate([
        {
          $match: {
            $and: [{ isPremium: true }, { city: city }],
          },
        },
        ...this.addFieldId,
        ...this.commentsLookup,
        { $limit: offerConstants.OfferCount.Premium },
        { $sort: { createdAt: SortType.Down } },
      ])
      .exec();
  }

  public async findFavorites(): Promise<DocumentType<OfferEntity>[]> {
    return await this.offerModel
      .find({ favorites: true })
      .sort({ createdAt: SortType.Down })
      .populate(['userId'])
      .exec();
  }

  public async incCommentCount(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, { $inc: { commentCount: 1 } })
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }
}
