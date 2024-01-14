import { ICommand } from './command.interface.js';

export class ImportCommand implements ICommand {
  public getName(): string {
    return '--import';
  }

  public execute(...parameters: string[]): void {
    // Чтение файла
  }
}
