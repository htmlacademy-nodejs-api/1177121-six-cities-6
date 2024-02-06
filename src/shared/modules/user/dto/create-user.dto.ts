import { EUserType } from '../../../types/index.js';

export class CreateUserDto {
  public name: string;
  public email: string;
  public avatar: string;
  public userType: EUserType;
  public password: string;
}
