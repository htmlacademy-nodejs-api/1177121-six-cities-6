import chalk from 'chalk';
import { TypeMessage } from '../shared/constants/index.js';
import { ICommand } from './commands/command.interface.js';
import { CommandParser } from './command-parser.js';
import { Command } from './commands/command.constants.js';

type CommandCollection = Record<string, ICommand>;

export class CLIApplication {
  private commands: CommandCollection = {};

  constructor(private readonly defaultCommand: string = Command.Help) {}

  public registerCommands(commandList: ICommand[]): void {
    commandList.forEach((command) => {
      if (Object.hasOwn(this.commands, command.getName())) {
        throw new Error(`${chalk.redBright(TypeMessage.Error)}: Command ${chalk.yellow(command.getName())} is already registered`);
      }
      this.commands[command.getName()] = command;
    });
  }

  public getCommand(commandName: string): ICommand {
    return this.commands[commandName] ?? this.getDefaultCommand();
  }

  public getDefaultCommand(): ICommand | never {
    if (!this.commands[this.defaultCommand]) {
      throw new Error(
        `${chalk.redBright(TypeMessage.Error)}: The default command (${chalk.yellow(this.defaultCommand)}) is not registered.`
      );
    }
    return this.commands[this.defaultCommand];
  }

  public processCommand(argv: string[]): void {
    const parsedCommand = CommandParser.parse(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];
    command.execute(...commandArguments);
  }
}
