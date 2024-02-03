import chalk from 'chalk';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { createOffer, getErrorMessage } from '../../shared/helpers/index.js';
import { TypeMessage } from '../../shared/constants/index.js';
import { ICommand } from './command.interface.js';
import { Command } from './command.constants.js';

export class ImportCommand implements ICommand {
  public getName(): string {
    return Command.Import;
  }

  private onImportedLine(line: string) {
    const offer = createOffer(line);
    console.info(offer);
  }

  private onCompleteImport(count: number) {
    console.info(`${chalk.greenBright(TypeMessage.Success)}: ${chalk.yellow(count)} rows imported.`);
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;
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
