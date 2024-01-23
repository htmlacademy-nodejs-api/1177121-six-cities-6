import { readFileSync } from 'node:fs';
import { UNICODE } from '../../constants/index.js';
import { IFileReader } from './file-reader.interface.js';

export class TSVFileReader implements IFileReader {
  private rawData = '';

  constructor(private readonly filename: string) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: UNICODE });
  }
}
