import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  BaseController,
  EHttpMethod,
  HttpError,
  PrivateRouteMiddleware,
  UploadFileMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { IConfig, TRestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/index.js';
import { Env, userConstants } from '../../constants/index.js';
import { IAuthService } from '../auth/index.js';
import { TCreateUserRequest, TLoginUserRequest } from './types/index.js';
import { LoggedUserRdo, UploadUserAvatarRdo, UserRdo } from './rdo/index.js';
import { CreateUserDto, LoginUserDto } from './dto/index.js';
import { IUserService } from './user-service.interface.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: ILogger,
    @inject(Component.UserService) private readonly userService: IUserService,
    @inject(Component.Config) private readonly configService: IConfig<TRestSchema>,
    @inject(Component.AuthService) private readonly authService: IAuthService,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: userConstants.Path.Register,
      method: EHttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)],
    });
    this.addRoute({
      path: userConstants.Path.Login,
      method: EHttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)],
    });
    this.addRoute({
      path: userConstants.Path.Logout,
      method: EHttpMethod.Post,
      handler: this.logout,
    });
    this.addRoute({
      path: userConstants.Path.Login,
      method: EHttpMethod.Get,
      handler: this.checkAuthToken,
      middlewares: [
        new PrivateRouteMiddleware(),
      ],
    });
    this.addRoute({
      path: userConstants.Path.UserIdAvatar,
      method: EHttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get(Env.UploadDirectory), 'avatar'),
      ],
    });
  }

  public async create(
    { body, tokenPayload }: TCreateUserRequest,
    res: Response
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (tokenPayload?.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'Access Denied',
        'User Controller'
      );
    }

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(
      body,
      this.configService.get(Env.Salt)
    );

    this.created(res, fillDTO(UserRdo, result));
  }

  public async login(
    { body }: TLoginUserRequest,
    res: Response
  ): Promise<void> {
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    const responseData = fillDTO(LoggedUserRdo, {
      email: user.email,
      token,
    });

    this.ok(res, responseData);
  }

  public async logout(): Promise<void> {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController'
    );
  }

  public async checkAuthToken(
    { tokenPayload: { email } }: Request,
    res: Response
  ): Promise<void> {
    const foundedUser = await this.userService.findByEmail(email);

    if (!foundedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    this.ok(res, fillDTO(LoggedUserRdo, foundedUser));
  }

  public async uploadAvatar({ params, file }: Request, res: Response) {
    const { id } = params;
    const uploadFile = { avatar: file?.filename };

    await this.userService.updateById(id, uploadFile);
    this.created(res, fillDTO(UploadUserAvatarRdo, { filepath: uploadFile.avatar }));
  }
}
