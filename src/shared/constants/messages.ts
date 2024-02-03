export const TypeMessage = {
  Error: 'Error',
  Success: 'Success',
} as const;

export const ErrorMessage = {
  ReadFile: 'File was not read',
  ParseFile: 'Failed to parse json content.',
  ReadEnv: 'Can\'t read .env file. Perhaps the file does not exists.',
  GenerateData: 'Can\'t generate data',
} as const;
