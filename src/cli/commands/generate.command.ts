
import got from 'got';
import { DECIMAL_SYSTEM } from '../../shared/constants/index.js';
import { TMockServerData } from '../../shared/types/mock-server-data.type.js';
import { Command } from './command.constants.js';
import { ICommand } from './command.interface.js';
import chalk from 'chalk';

export class GenerateCommand implements ICommand {
  private initialData: TMockServerData;

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`Can't load data from ${chalk.redBright(url)}`);
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
    } catch (error: unknown) {
      console.error('Can\'t generate data');

      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
}
