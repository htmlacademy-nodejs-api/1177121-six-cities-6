import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { EUserType, TUser } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';
import { IMAGE_REGEX, userConstants } from '../../constants/index.js';
import { UserMessages } from './dto/user.messages.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  },
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements TUser {
  @prop({
    required: true,
    minlength: [userConstants.NameLength.Min, UserMessages.name.lengthField],
    maxlength: [userConstants.NameLength.Max, UserMessages.name.lengthField],
    default: '',
  })
  public name!: string;

  @prop({
    required: true,
    unique: true,
    match: [userConstants.EMAIL_REGEX, UserMessages.email],
  })
  public email!: string;

  @prop({
    required: false,
    trim: true,
    match: [IMAGE_REGEX, UserMessages.avatar.matches],
    default: userConstants.DEFAULT_AVATAR,
  })
  public avatar!: string;

  @prop({
    type: () => String,
    required: true,
    enum: EUserType,
    default: EUserType.Standard,
  })
  public userType!: EUserType;

  @prop({ required: true, default: '' })
  private password?: string;

  @prop({
    type: Types.ObjectId,
    default: [],
  })
  public favoriteOffers: Types.Array<Types.ObjectId>;

  constructor(userData: TUser) {
    super();

    this.name = userData.name;
    this.email = userData.email;
    this.avatar = userData.avatar;
    this.userType = userData.userType;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
