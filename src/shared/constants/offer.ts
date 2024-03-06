export const OfferCount = {
  Default: 60,
  Premium: 3,
} as const;

export const TitleLength = {
  Min: 10,
  Max: 100,
} as const;

export const DescriptionLength = {
  Min: 20,
  Max: 1024,
} as const;

export const PhotosArrayLength = {
  Min: 6,
  Max: 6,
} as const;

export const WeekDay = {
  First: 1,
  Last: 7,
} as const;

export const BooleanString = {
  True: 'true',
  False: 'false',
} as const;

export const Rating = {
  Min: 1,
  Max: 5,
} as const;

export const RoomCount = {
  Min: 1,
  Max: 8,
} as const;

export const GuestCount = {
  Min: 1,
  Max: 10,
} as const;

export const Price = {
  Min: 100,
  Max: 100000,
} as const;

export const CommentCount = {
  Min: 1,
  Max: 10,
} as const;

export const Cities = {
  Paris: {
    latitude: 48.85661,
    longitude: 2.351499,
  },

  Cologne: {
    latitude: 50.938361,
    longitude: 6.959974,
  },

  Brussels: {
    latitude: 50.846557,
    longitude: 4.351697,
  },

  Amsterdam: {
    latitude: 52.370216,
    longitude: 4.895168,
  },

  Hamburg: {
    latitude: 53.550341,
    longitude: 10.000654,
  },

  Dusseldorf: {
    latitude: 51.225402,
    longitude: 6.776314,
  },
} as const;

export const PathOffer = {
  Create: '/',
  Update: '/:offerId',
  Delete: '/:offerId',
  Show: '/:offerId',
  Index: '/',
  Premium: '/premium/:city',
  Favorites: '/favorites',
  toggleFavorites: '/:offerId/favorites',
  Comments: '/:offerId/comments',
} as const;
