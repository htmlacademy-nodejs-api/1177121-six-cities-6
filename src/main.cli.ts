#!/usr/bin/env node
import chalk from 'chalk';
import { glob } from 'glob';
import { resolve } from 'node:path';
import {
  CLIApplication,
  DIR_PATH,
  FILE_EXTENSION,
  ICommand,
} from './cli/index.js';

async function bootstrap() {
  const cliApplication = new CLIApplication();
  const commands: ICommand[] = [];
  const pattern = `${DIR_PATH}/*${FILE_EXTENSION}`;
  const commandFiles = glob.sync(pattern);

  for (const commandFile of commandFiles) {
    const modulePath = resolve(commandFile);
    const importedModule = await import(modulePath);

    for (const commandClass in importedModule) {
      const CommandClass = importedModule[commandClass];

      try {
        commands.push(new CommandClass());
      } catch (error) {
        console.error(`Command not found in ${chalk.redBright(commandFile)}`);
      }
    }
  }

  cliApplication.registerCommands(commands);
  cliApplication.processCommand(process.argv);
}

bootstrap();
