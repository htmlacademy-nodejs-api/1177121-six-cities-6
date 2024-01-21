import chalk from 'chalk';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { ICommand } from './command.interface.js';
import { Command } from './command.constants.js';

export class ImportCommand implements ICommand {
  public getName(): string {
    return Command.Import;
  }

  public execute(...parameters: string[]): void {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (err) {
      if (!(err instanceof Error)) {
        throw err;
      }

      console.error(`Can't import data from file: ${chalk.redBright(filename)}`);
      console.error(`Details: ${err.message}`);
    }
  }
}
