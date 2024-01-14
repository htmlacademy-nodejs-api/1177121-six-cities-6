import { EUserRole } from './user-role.enum.js';

export type TUser = {
  name: string;
  email: string;
  avatar: string;
  userType: EUserRole;
}
