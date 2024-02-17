import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { UserEntity } from '../user/index.js';
import { OfferEntity } from '../offer/index.js';
import { commentConstants, offerConstants } from '../../constants/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments',
    timestamps: true,
  },
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({
    type: String,
    required: true,
    minlength: commentConstants.TextLength.Min,
    maxlength: commentConstants.TextLength.Max,
    trim: true,
  })
  public text!: string;

  @prop({
    type: Number,
    required: true,
    min: offerConstants.Rating.Min,
    max: offerConstants.Rating.Max,
  })
  public rating!: number;

  @prop({
    type: String,
    ref: OfferEntity,
    required: true,
  })
  public offerId!: Ref<OfferEntity>;

  @prop({
    type: String,
    required: true,
    ref: UserEntity,
  })
  public userId!: Ref<UserEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
