import chalk from 'chalk';
import { config } from 'dotenv';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/index.js';
import { Component } from '../../types/index.js';
import { IConfig } from './config.interface.js';
import { configRestSchema, RestSchema } from './rest.schema.js';

@injectable()
export class RestConfig implements IConfig<RestSchema> {
  private readonly config: RestSchema;

  constructor(
    @inject(Component.Logger) private readonly logger: ILogger
  ) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error(`${chalk.redBright('Error')}: Can't read .env file. Perhaps the file does not exists.`);
    }

    configRestSchema.load({});
    configRestSchema.validate({ allowed: 'strict', output: this.logger.info });

    this.config = configRestSchema.getProperties();
    this.logger.info('.env file found and successfully parsed!');
  }

  public get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config[key];
  }
}
