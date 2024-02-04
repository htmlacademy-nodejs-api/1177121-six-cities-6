import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
  Severity,
} from '@typegoose/typegoose';
import { DescriptionLength, TitleLength, GuestCount, Price, Rating, RoomCount } from '../../constants/index.js';
import { EAmenity, ECity, EHouseType, TLocation } from '../../types/index.js';
import { UserEntity } from '../user/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
  },
  options: {
    allowMixed: Severity.ALLOW
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({
    require: true,
    minlength: TitleLength.Min,
    maxlength: TitleLength.Max,
  })
  public title!: string;

  @prop({
    required: true,
    minlength: DescriptionLength.Min,
    maxlength: DescriptionLength.Max,
  })
  public description!: string;

  @prop({ required: true })
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
    match: [
      /\.(jpg|png)(\?.*)?$/i,
      'The avatar image must match the format .jpg or .png',
    ],
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
    min: Rating.Min,
    max: Rating.Max,
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
    min: RoomCount.Min,
    max: RoomCount.Max,
  })
  public roomsCount!: number;

  @prop({
    required: true,
    min: GuestCount.Min,
    max: GuestCount.Max,
  })
  public guestsCount!: number;

  @prop({
    required: true,
    min: Price.Min,
    max: Price.Max,
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
