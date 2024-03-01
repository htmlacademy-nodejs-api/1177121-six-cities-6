import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { EUserType } from '../../../types/index.js';
import { IMAGE_REGEX, userConstants } from '../../../constants/index.js';
import { UserMessages } from './user.messages.js';

export class CreateUserDto {
  @IsString({ message: UserMessages.name.invalidFormat })
  @Length(userConstants.NameLength.Min, userConstants.NameLength.Max, {
    message: UserMessages.name.lengthField,
  })
  public name: string;

  @IsEmail({}, { message: UserMessages.email.invalidFormat })
  public email: string;

  @IsOptional()
  @Matches(IMAGE_REGEX, {
    message: UserMessages.avatar.matches,
  })
  public avatar: string;

  @IsEnum(EUserType, {
    message: UserMessages.userType.invalid,
  })
  public userType: EUserType;

  @IsString({ message: UserMessages.password.invalidFormat })
  @Length(userConstants.PasswordLength.Min, userConstants.PasswordLength.Max, {
    message: UserMessages.password.lengthField,
  })
  public password: string;
}
