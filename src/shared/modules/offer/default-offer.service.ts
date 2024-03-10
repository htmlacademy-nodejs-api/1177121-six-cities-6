import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { Component, SortType } from '../../types/index.js';
import { offerConstants } from '../../constants/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { UserEntity } from '../user/index.js';
import { IOfferService } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto, UpdateOfferDto } from './dto/index.js';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { HttpError } from '../../libs/rest/index.js';
@injectable()
export class DefaultOfferService implements IOfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.UserModel)
    private readonly userModel: types.ModelType<UserEntity>
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
    return await this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true, })
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

  public async findFavorites(
    userId: string
  ): Promise<DocumentType<OfferEntity>[]> {
    const user = await this.userModel.findById(userId);

    return this.offerModel
      .aggregate([
        {
          $match: {
            _id: { $in: user?.favoriteOffers },
          },
        },
        {
          $set: {
            favorites: true,
          },
        },
        { $sort: { createdAt: SortType.Down } },
      ])
      .exec();
  }

  public async toggleFavorite(
    userId: string,
    offerId: string,
    isFavorite: boolean
  ): Promise<boolean> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${userId} not found.`,
        'DefaultOfferService'
      );
    }

    const offerObjectId = new Types.ObjectId(offerId);

    if (!isFavorite) {
      user.favoriteOffers.pull(offerObjectId);

      await user.save();

      return false;
    } else {
      user.favoriteOffers.push(offerObjectId);

      await user.save();

      return true;
    }
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

  public async isUser(
    userId: string,
    documentId: string
  ): Promise<boolean> {
    const offer = await this.offerModel.findById(documentId);

    return offer?.userId.toString() === userId;
  }
}
