export const Jwt = {
  Algorithm: 'HS256',
  Expired: '2d',
} as const;

export const ErrorException = {
  UserNotFound: 'User not found',
  UserPasswordIncorrect: 'Incorrect user name or password',
} as const;
