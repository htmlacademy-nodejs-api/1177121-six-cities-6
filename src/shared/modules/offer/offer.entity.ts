import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
  Severity,
} from '@typegoose/typegoose';
import { IMAGE_REGEX, offerConstants } from '../../constants/index.js';
import { EAmenity, ECity, EHouseType, TLocation } from '../../types/index.js';
import { UserEntity } from '../user/index.js';
import { OfferValidationMessage } from './index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({
    require: true,
    minlength: offerConstants.TitleLength.Min,
    maxlength: offerConstants.TitleLength.Max,
    trim: true,
  })
  public title!: string;

  @prop({
    required: true,
    minlength: offerConstants.DescriptionLength.Min,
    maxlength: offerConstants.DescriptionLength.Max,
    trim: true,
  })
  public description!: string;

  @prop({ required: true, default: Date.now })
  public postDate!: Date;

  @prop({
    type: () => String,
    required: true,
    enum: ECity,
  })
  public city!: ECity;

  @prop({
    required: true,
    trim: true,
    match: [IMAGE_REGEX, OfferValidationMessage.preview.matches],
  })
  public preview!: string;

  @prop({
    type: () => [String],
    default: [],
    required: true,
  })
  public photos!: string[];

  @prop({
    require: true,
    default: false,
  })
  public isPremium!: boolean;

  @prop({
    require: true,
    default: false,
  })
  public isFavorite!: boolean;

  @prop({
    require: true,
  })
  public rating!: number;

  @prop({
    type: () => String,
    enum: EHouseType,
    required: true,
  })
  public houseType!: EHouseType;

  @prop({
    required: true,
    min: offerConstants.RoomCount.Min,
    max: offerConstants.RoomCount.Max,
  })
  public roomsCount!: number;

  @prop({
    required: true,
    min: offerConstants.GuestCount.Min,
    max: offerConstants.GuestCount.Max,
  })
  public guestsCount!: number;

  @prop({
    required: true,
    min: offerConstants.Price.Min,
    max: offerConstants.Price.Max,
  })
  public price!: number;

  @prop({
    default: [],
    type: () => [String],
    required: true,
  })
  public amenities!: EAmenity[];

  @prop({ default: 0 })
  public commentCount!: number;

  @prop({
    ref: UserEntity,
    required: true,
  })
  public userId!: Ref<UserEntity>;

  @prop({
    required: true,
  })
  public location!: TLocation;
}

export const OfferModel = getModelForClass(OfferEntity);
