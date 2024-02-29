export const EMAIL_REGEX = /^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
export const DEFAULT_AVATAR = 'default-avatar.jpg';

export const NameLength = {
  Min: 1,
  Max: 15,
} as const;

export const PasswordLength = {
  Min: 6,
  Max: 12,
} as const;
