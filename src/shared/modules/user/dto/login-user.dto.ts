import {
  IsEmail,
  IsString,
  Length,
} from 'class-validator';
import { userConstants } from '../../../constants/index.js';
import { UserMessages } from './user.messages.js';

export class LoginUserDto {
  @IsEmail({}, { message: UserMessages.email.invalidFormat })
  public email: string;

  @IsString({ message: UserMessages.password.invalidFormat })
  @Length(userConstants.PasswordLength.Min, userConstants.PasswordLength.Max, {
    message: UserMessages.password.lengthField,
  })
  public password: string;
}
