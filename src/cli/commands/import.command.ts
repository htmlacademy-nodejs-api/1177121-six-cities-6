import chalk from 'chalk';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { createOffer, getErrorMessage, getMongoURI } from '../../shared/helpers/index.js';
import { TypeMessage } from '../../shared/constants/index.js';
import { ICommand } from './command.interface.js';
import { Command, DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD } from './command.constants.js';
import { DefaultUserService, IUserService, UserModel } from '../../shared/modules/user/index.js';
import { DefaultOfferService, IOfferService, OfferModel } from '../../shared/modules/offer/index.js';
import { IDatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { ConsoleLogger, ILogger } from '../../shared/libs/logger/index.js';
import { TOffer } from '../../shared/types/index.js';

export class ImportCommand implements ICommand {
  private userService: IUserService;
  private offerService: IOfferService;
  private databaseClient: IDatabaseClient;
  private logger: ILogger;
  private salt: string;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  private async onImportedLine(line: string, resolve: () => void) {
    const offer = createOffer(line);

    await this.saveOffer(offer);
    resolve();
  }

  private onCompleteImport(count: number) {
    console.info(`${chalk.greenBright(TypeMessage.Success)}: ${chalk.yellow(count)} rows imported.`);
    this.databaseClient.disconnect();
  }

  private async saveOffer(offer: TOffer) {
    const author = await this.userService.findOrCreate({
      ...offer.author,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    await this.offerService.create({
      userId: author.id,
      title: offer.title,
      description: offer.description,
      postDate: offer.postDate,
      city: offer.city,
      preview: offer.preview,
      photos: offer.photos,
      isPremium: offer.isPremium,
      houseType: offer.houseType,
      roomsCount: offer.roomsCount,
      guestsCount: offer.guestsCount,
      price: offer.price,
      amenities: offer.amenities,
      location: offer.location
    });
  }

  public getName(): string {
    return Command.Import;
  }

  public async execute(
    filename: string,
    login: string,
    password: string,
    host: string,
    dbname: string,
    salt: string
  ): Promise<void> {
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      console.error(`${chalk.redBright(TypeMessage.Error)}: Can't import data from file: ${chalk.bold.whiteBright(filename)}`);
      console.error(getErrorMessage(error));
    }
  }
}
