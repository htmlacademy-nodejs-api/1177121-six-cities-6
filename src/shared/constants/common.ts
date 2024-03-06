export const UNICODE = 'utf-8';
export const DECIMAL_SYSTEM = 10;
export const DAY_UNIT = 'day';
export const IMAGE_REGEX = /\.(jpg|png|svg)(\?.*)?$/i;

export const Env = {
  DbUser: 'DB_USER',
  DbPassword: 'DB_PASSWORD',
  DbHost: 'DB_HOST',
  DbPort: 'DB_PORT',
  DbName: 'DB_NAME',
  JwtSecret: 'JWT_SECRET',
  UploadDirectory: 'UPLOAD_DIRECTORY',
  StaticDirectory: 'STATIC_DIRECTORY_PATH',
  Host: 'HOST',
  Salt: 'SALT',
  Port: 'PORT',
} as const;

export const AppRoutes = {
  Users: 'users',
  Offers: 'offers',
  Comments: 'comments',
} as const;
