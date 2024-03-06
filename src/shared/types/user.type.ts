import { EUserType } from './user-type.enum.js';

export type TUser = {
  name: string;
  email: string;
  avatar?: string;
  userType: EUserType;
}
