
import got from 'got';
import chalk from 'chalk';
import { appendFile } from 'node:fs/promises';
import { DECIMAL_SYSTEM, UNICODE } from '../../shared/constants/index.js';
import { TMockServerData } from '../../shared/types/mock-server-data.type.js';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/index.js';
import { Command } from './command.constants.js';
import { ICommand } from './command.interface.js';

export class GenerateCommand implements ICommand {
  private initialData: TMockServerData;

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`${chalk.redBright('Error')}: Can't load data from ${chalk.redBright(url)}`);
    }
  }

  private async write(filepath: string, offerCount: number) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);

    for (let i = 0; i < offerCount; i++) {
      await appendFile(
        filepath,
        `${tsvOfferGenerator.generate()}\n`,
        { encoding: UNICODE }
      );
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
      console.info(`${chalk.greenBright('Success')}: File ${chalk.green(filepath)} was created!`);
    } catch (error: unknown) {
      console.error(`${chalk.redBright('Error')}: Can't generate data`);

      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
}
