import chalk from 'chalk';
import { ICommand } from './command.interface.js';
import { Command } from './command.constants.js';

export class HelpCommand implements ICommand {
  public getName(): string {
    return Command.Help;
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
        ${chalk.bold.magentaBright('Программа для подготовки данных для REST API сервера.')}

        ${chalk.white('Пример:')} ${chalk.yellowBright('cli.js --<command> [--arguments]')}

        ${chalk.white('Команды:')}
            ${chalk.green(`${Command.Version}:`)}                   # выводит номер версии
            ${chalk.green(`${Command.Help}:`)}                      # печатает этот текст
            ${chalk.green(`${Command.Import} <path>: `)}            # импортирует данные из TSV
            ${chalk.green(`${Command.Generate} <n> <path> <url>`)}  # генерирует произвольное количество тестовых данных
    `);
  }
}
