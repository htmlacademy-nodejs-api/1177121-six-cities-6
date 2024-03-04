import { inject, injectable } from 'inversify';
import * as crypto from 'node:crypto';
import { SignJWT } from 'jose';
import { Component } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { IConfig, TRestSchema } from '../../libs/config/index.js';
import { Env, UNICODE } from '../../constants/index.js';
import { LoginUserDto, UserEntity, IUserService } from '../user/index.js';
import { IAuthService } from './auth-service.interface.js';
import { TTokenPayload } from './types/TokenPayload.js';
import {
  UserNotFoundException,
  UserPasswordIncorrectException,
} from './errors/index.js';
import { Jwt } from './auth.constant.js';

@injectable()
export class DefaultAuthService implements IAuthService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.UserService) private readonly userService: IUserService,
    @inject(Component.Config) private readonly config: IConfig<TRestSchema>
  ) {}

  public async authenticate(user: UserEntity): Promise<string> {
    const jwtSecret = this.config.get(Env.JwtSecret);
    const secretKey = crypto.createSecretKey(jwtSecret, UNICODE);
    const tokenPayload: TTokenPayload = {
      email: user.email,
      name: user.name,
      id: user.id,
    };

    this.logger.info(`Create token for ${user.email}`);

    return new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: Jwt.Algorithm })
      .setIssuedAt()
      .setExpirationTime(Jwt.Expired)
      .sign(secretKey);
  }

  public async verify(dto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      this.logger.warn(`User with ${dto.email} not found`);
      throw new UserNotFoundException();
    }

    if (!user.verifyPassword(dto.password, this.config.get('SALT'))) {
      this.logger.warn(`Incorrect password for ${dto.email}`);
      throw new UserPasswordIncorrectException();
    }

    return user;
  }
}
