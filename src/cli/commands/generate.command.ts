
import { DECIMAL_SYSTEM } from '../../shared/constants/index.js';
import { Command } from './command.constants.js';
import { ICommand } from './command.interface.js';

export class GenerateCommand implements ICommand {
  public getName(): string {
    return Command.Generate;
  }

  public execute(...parameters: string[]): void {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, DECIMAL_SYSTEM);

    // Код для получения данных с сервера.
    // Формирование объявлений.
  }
}
