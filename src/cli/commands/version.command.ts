import chalk from 'chalk';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ErrorMessage, TypeMessage, UNICODE } from '../../shared/constants/index.js';
import { getErrorMessage } from '../../shared/helpers/index.js';
import { ICommand } from './command.interface.js';
import { Command } from './command.constants.js';

type PackageJSONConfig = {
  version: string;
};

function isPackageJSONConfig(value: unknown): value is PackageJSONConfig {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.hasOwn(value, 'version')
  );
}

export class VersionCommand implements ICommand {
  constructor(private readonly filePath: string = './package.json') {}

  private readVersion(): string {
    const jsonContent = readFileSync(resolve(this.filePath), UNICODE);
    const importedContent: unknown = JSON.parse(jsonContent);

    if (!isPackageJSONConfig(importedContent)) {
      throw new Error(ErrorMessage.ParseFile);
    }

    return importedContent.version;
  }

  public getName(): string {
    return Command.Version;
  }

  public async execute(..._parameters: string[]): Promise<void> {
    try {
      const version = this.readVersion();
      console.info(version);
    } catch (error: unknown) {
      console.error(`${chalk.redBright(TypeMessage.Error)}: Failed to read version from ${chalk.bold.whiteBright(this.filePath)}`);

      console.error(getErrorMessage(error));
    }
  }
}
