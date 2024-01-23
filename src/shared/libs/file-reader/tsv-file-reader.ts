import EventEmitter from 'node:events';
import { UNICODE } from '../../constants/index.js';
import { IFileReader } from './file-reader.interface.js';

export class TSVFileReader implements IFileReader {
  private rawData = '';

  constructor(private readonly filename: string) {}

  public read(): void {
    // Код для работы с потоками
  }
}
