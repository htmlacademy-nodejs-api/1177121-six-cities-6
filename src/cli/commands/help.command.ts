import chalk from 'chalk';
import { ICommand } from './command.interface.js';

export class HelpCommand implements ICommand {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
        ${chalk.bold.magentaBright('Программа для подготовки данных для REST API сервера.')}

        ${chalk.white('Пример:')} ${chalk.yellowBright('cli.js --<command> [--arguments]')}

        ${chalk.white('Команды:')}
            ${chalk.green('--version:')}                   # выводит номер версии
            ${chalk.green('--help:')}                      # печатает этот текст
            ${chalk.green('--import <path>: ')}            # импортирует данные из TSV
            ${chalk.green('--generate <n> <path> <url>')}  # генерирует произвольное количество тестовых данных
    `);
  }
}
