import { IFileReader } from './file-reader.interface.js';
import { readFileSync } from 'node:fs';
import { TOffer } from '../../types/index.js';
import { createOffer } from '../../helpers/index.js';
import { ErrorMessage, UNICODE } from '../../constants/index.js';

export class TSVFileReader implements IFileReader {
  private rawData = '';

  constructor(private readonly filename: string) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: UNICODE });
  }

  public toArray(): TOffer[] {
    if (!this.rawData) {
      throw new Error(ErrorMessage.ReadFile);
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(createOffer);
  }
}
