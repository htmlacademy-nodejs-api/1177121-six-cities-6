import {inject, injectable} from 'inversify';
import express, { Express } from 'express';
import cors from 'cors';
import { ILogger } from '../shared/libs/logger/index.js';
import { IConfig, TRestSchema } from '../shared/libs/config/index.js';
import { Component } from '../shared/types/index.js';
import { IDatabaseClient } from '../shared/libs/database-client/index.js';
import { getFullServerPath, getMongoURI } from '../shared/helpers/index.js';
import {
  IController,
  IExceptionFilter,
  ParseTokenMiddleware,
} from '../shared/libs/rest/index.js';
import { AppRoutes, Env } from '../shared/constants/index.js';
import { StaticPath } from './rest.constant.js';


@injectable()
export class RestApplication {
  private readonly server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.Config) private readonly config: IConfig<TRestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: IDatabaseClient,
    @inject(Component.ExceptionFilter) private readonly appExceptionFilter: IExceptionFilter,
    @inject(Component.UserController) private readonly userController: IController,
    @inject(Component.OfferController) private readonly offerController: IController,
    @inject(Component.CommentController) private readonly commentController: IController,
    @inject(Component.AuthExceptionFilter) private readonly authExceptionFilter: IExceptionFilter,
    @inject(Component.HttpExceptionFilter) private readonly httpExceptionFilter: IExceptionFilter,
    @inject(Component.ValidationExceptionFilter) private readonly validationExceptionFilter: IExceptionFilter,
  ) {
    this.server = express();
  }

  private async initDb(): Promise<void> {
    const mongoUri = getMongoURI(
      this.config.get(Env.DbUser),
      this.config.get(Env.DbPassword),
      this.config.get(Env.DbHost),
      this.config.get(Env.DbPort),
      this.config.get(Env.DbName),
    );

    return this.databaseClient.connect(mongoUri);
  }

  private async _initServer() {
    const port = this.config.get(Env.Port);
    this.server.listen(port);
  }

  private async _initControllers() {
    this.server.use(`/${AppRoutes.Users}`, this.userController.router);
    this.server.use(`/${AppRoutes.Offers}`, this.offerController.router);
    this.server.use(`/${AppRoutes.Comments}`, this.commentController.router);
  }

  private async _initMiddleware() {
    const authenticateMiddleware = new ParseTokenMiddleware(this.config.get(Env.JwtSecret));

    this.server.use(express.json());
    this.server.use(
      StaticPath.Upload,
      express.static(this.config.get(Env.UploadDirectory))
    );
    this.server.use(
      StaticPath.Static,
      express.static(this.config.get(Env.StaticDirectory))
    );
    this.server.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
    this.server.use(cors());
  }

  private async _initExceptionFilters() {
    this.server.use(this.authExceptionFilter.catch.bind(this.authExceptionFilter));
    this.server.use(this.validationExceptionFilter.catch.bind(this.validationExceptionFilter));
    this.server.use(this.httpExceptionFilter.catch.bind(this.httpExceptionFilter));
    this.server.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
  }

  public async init() {
    this.logger.info('Application initialization');

    this.logger.info('Init database…');
    await this.initDb();
    this.logger.info('Init database completed');

    this.logger.info('Init app-level middleware');
    await this._initMiddleware();
    this.logger.info('App-level middleware initialization completed');

    this.logger.info('Init controllers');
    await this._initControllers();
    this.logger.info('Controller initialization completed');

    this.logger.info('Init exception filters');
    await this._initExceptionFilters();
    this.logger.info('Exception filters initialization completed');

    this.logger.info('Try to init server…');
    await this._initServer();

    this.logger.info(`🚀 Server started on ${getFullServerPath(this.config.get(Env.Host), this.config.get(Env.Port))}`);
  }
}
