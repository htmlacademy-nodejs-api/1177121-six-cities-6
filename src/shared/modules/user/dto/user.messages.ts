import { userConstants } from '../../../constants/index.js';
import { EUserType } from '../../../types/index.js';

export const UserMessages = {
  name: {
    invalidFormat: 'Name is required',
    lengthField: `Min length is ${userConstants.NameLength.Min}, max is ${userConstants.NameLength.Max}`,
  },
  email: {
    invalidFormat: 'Email must be a valid address',
  },
  avatar: {
    matches: 'The image must match the format .jpg or .png',
  },
  userType: {
    invalid: `User type must be ${EUserType.Standard} or ${EUserType.Pro}`,
  },
  password: {
    invalidFormat: 'Password is required',
    lengthField: `Min length for password is ${userConstants.PasswordLength.Min}, Max is ${userConstants.PasswordLength.Max}`,
  },
} as const;
