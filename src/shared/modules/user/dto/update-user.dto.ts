import { EUserType } from '../../../types/index.js';

export class UpdateUserDto {
  public name?: string;
  public email?: string;
  public avatar?: string;
  public userType?: EUserType;
  public password?: string;
}
