import { getModelForClass, prop } from '@typegoose/typegoose';
import { EUserType, TUser } from '../../types/index.js';

export class UserEntity implements TUser {
  @prop({
    required: true,
    minlength: [2, 'Min length for name is 2'],
    default: '',
  })
  public name!: string;

  @prop({
    required: true,
    unique: true,
    match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect'],
  })
  public email!: string;

  @prop({
    required: false,
    match: [/\.(jpg|png)(\?.*)?$/i, 'The avatar image must match the format .jpg or .png'],
    default: '',
  })
  public avatar!: string;

  @prop({
    required: true,
    enum: EUserType,
    default: EUserType.Standard,
  })
  public userType!: EUserType;
}

export const UserModel = getModelForClass(UserEntity);
