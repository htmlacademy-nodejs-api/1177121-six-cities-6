
import got from 'got';
import chalk from 'chalk';
import { DECIMAL_SYSTEM, ErrorMessage, TypeMessage } from '../../shared/constants/index.js';
import { TMockServerData } from '../../shared/types/mock-server-data.type.js';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/index.js';
import { getErrorMessage } from '../../shared/helpers/index.js';
import { TSVFileWriter } from '../../shared/libs/file-writer/index.js';
import { Command } from './command.constants.js';
import { ICommand } from './command.interface.js';

export class GenerateCommand implements ICommand {
  private initialData: TMockServerData;

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`${chalk.redBright(TypeMessage.Error)}: Can't load data from ${chalk.bold.whiteBright(url)}`);
    }
  }

  private async write(filepath: string, offerCount: number) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(tsvOfferGenerator.generate());
    }
  }

  public getName(): string {
    return Command.Generate;
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, DECIMAL_SYSTEM);

    try {
      await this.load(url);
      await this.write(filepath, offerCount);

      console.info(`${chalk.greenBright(TypeMessage.Success)}: File ${chalk.bold.whiteBright(filepath)} was created!`);
    } catch (error: unknown) {
      console.error(`${chalk.redBright(TypeMessage.Error)}: ${ErrorMessage.GenerateData}`);
      console.error(getErrorMessage(error));
    }
  }
}
