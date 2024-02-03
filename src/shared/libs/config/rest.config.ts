import chalk from 'chalk';
import { config } from 'dotenv';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { ErrorMessage, TypeMessage } from '../../constants/index.js';
import { ILogger } from '../logger/index.js';
import { IConfig } from './config.interface.js';
import { configRestSchema, TRestSchema } from './rest.schema.js';

@injectable()
export class RestConfig implements IConfig<TRestSchema> {
  private readonly config: TRestSchema;

  constructor(
    @inject(Component.Logger) private readonly logger: ILogger
  ) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error(`${chalk.redBright(TypeMessage.Error)}: ${ErrorMessage.ReadEnv}`);
    }

    configRestSchema.load({});
    configRestSchema.validate({ allowed: 'strict', output: this.logger.info });

    this.config = configRestSchema.getProperties();
    this.logger.info('.env file found and successfully parsed!');
  }

  public get<T extends keyof TRestSchema>(key: T): TRestSchema[T] {
    return this.config[key];
  }
}
