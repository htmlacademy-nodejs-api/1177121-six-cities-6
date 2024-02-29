import { offerConstants } from '../../../constants/index.js';
import { formatsObjectToString } from '../../../helpers/index.js';
import { EAmenity, ECity, EHouseType } from '../../../types/index.js';

export const OfferValidationMessage = {
  title: {
    minLength: `Minimum title length must be ${offerConstants.TitleLength.Min}`,
    maxLength: `Maximum title length must be ${offerConstants.TitleLength.Max}`,
  },
  description: {
    minLength: `Minimum description length must be ${offerConstants.DescriptionLength.Min}`,
    maxLength: `Maximum description length must be ${offerConstants.DescriptionLength.Max}`,
  },
  postDate: {
    invalidFormat: 'postDate must be a valid ISO date',
  },
  city: {
    invalid: `City must be one of: ${formatsObjectToString(ECity)}`,
  },
  preview: {
    matches: 'The image must match the format .jpg or .png',
  },
  photos: {
    invalidFormat: 'Photos must be an array',
    ArrayMinSize: `Photos must contain exactly ${offerConstants.PhotosArrayLength.Min} images`,
    ArrayMaxSize: `Photos must contain exactly ${offerConstants.PhotosArrayLength.Max} images`,
  },
  isPremium: {
    invalidFormat: 'isPremium must be an boolean',
  },
  houseType: {
    invalid: `houseType must be ${formatsObjectToString(EHouseType)}`,
  },
  roomsCount: {
    invalidFormat: 'roomsCount must be an integer',
    minValue: `Minimum roomsCount is ${offerConstants.RoomCount.Min}`,
    maxValue: `Maximum roomsCount is ${offerConstants.RoomCount.Max}`,
  },
  guestsCount: {
    invalidFormat: 'guestsCount must be an integer',
    minValue: `Minimum guestsCount is ${offerConstants.GuestCount.Min}`,
    maxValue: `Maximum guestsCount is ${offerConstants.GuestCount.Max}`,
  },
  price: {
    invalidFormat: 'rentPrice must be an integer',
    minValue: `Minimum price is ${offerConstants.Price.Min}`,
    maxValue: `Maximum price is ${offerConstants.Price.Max}`,
  },
  amenities: {
    invalid: `Field amenities must be an array and type must be ${formatsObjectToString(EAmenity)}`,
  },
  location: {
    invalidLatitude: 'Latitude must be a valid number',
    invalidLongitude: 'Longitude must be a valid number',
  },
  userId: {
    invalidId: 'userId field must be a valid id',
  },
} as const;
