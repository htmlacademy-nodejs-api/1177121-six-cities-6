import { inject, injectable } from 'inversify';
import {
  DEFAULT_STATIC_IMAGES,
  STATIC_RESOURCE_FIELDS,
} from './path-transformer.constant.js';
import { StaticPath } from '../../../../rest/index.js';
import { TypeJS } from '../../../constants/index.js';
import { getFullServerPath } from '../../../helpers/index.js';
import { Component } from '../../../types/index.js';
import { ILogger } from '../../logger/index.js';
import { IConfig, TRestSchema } from '../../config/index.js';

function isObject(value: unknown): value is Record<string, object> {
  return typeof value === TypeJS.Object && value !== null;
}

@injectable()
export class PathTransformer {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.Config) private readonly config: IConfig<TRestSchema>,
  ) {
    this.logger.info('PathTransformer created!');
  }

  private hasDefaultImage(value: string) {
    return DEFAULT_STATIC_IMAGES.includes(value);
  }

  private isStaticProperty(property: string) {
    return STATIC_RESOURCE_FIELDS.includes(property);
  }

  public execute(data: Record<string, unknown>): Record<string, unknown> {
    const stack = [data];
    while (stack.length > 0) {
      const current = stack.pop();

      for (const key in current) {
        if (Object.hasOwn(current, key)) {
          const value = current[key];

          if (isObject(value)) {
            stack.push(value);
            continue;
          }

          if (this.isStaticProperty(key) && typeof value === TypeJS.String) {
            const staticPath = StaticPath.Static;
            const uploadPath = StaticPath.Upload;
            const serverHost = this.config.get('HOST');
            const serverPort = this.config.get('PORT');

            const rootPath = this.hasDefaultImage(value) ? staticPath : uploadPath;
            current[key] = `${getFullServerPath(serverHost, serverPort)}${rootPath}/${value}`;
          }
        }
      }
    }

    return data;
  }
}
