import { StatusCodes } from 'http-status-codes';
import { ErrorException } from '../auth.constant.js';
import { BaseUserException } from './base-user.exception.js';

export class UserPasswordIncorrectException extends BaseUserException {
  constructor() {
    super(StatusCodes.UNAUTHORIZED, ErrorException.UserPasswordIncorrect);
  }
}
