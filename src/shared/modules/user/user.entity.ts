import { EUserType, TUser } from '../../types/index.js';

export class UserEntity implements TUser {
  public name: string;
  public email: string;
  public avatar: string;
  public userType: EUserType;
}
