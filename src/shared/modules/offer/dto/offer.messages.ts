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
    invalidFormat: 'Field postDate must be a valid ISO date',
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
    invalidFormat: 'Field isPremium must be an boolean',
  },
  houseType: {
    invalid: `House type must be ${formatsObjectToString(EHouseType)}`,
  },
  roomsCount: {
    invalidFormat: 'Rooms count must be an integer',
    minValue: `Minimum rooms count is ${offerConstants.RoomCount.Min}`,
    maxValue: `Maximum rooms count is ${offerConstants.RoomCount.Max}`,
  },
  guestsCount: {
    invalidFormat: 'Guests count must be an integer',
    minValue: `Minimum guests count is ${offerConstants.GuestCount.Min}`,
    maxValue: `Maximum guests count is ${offerConstants.GuestCount.Max}`,
  },
  price: {
    invalidFormat: 'Price must be an integer',
    minValue: `Minimum price is ${offerConstants.Price.Min}`,
    maxValue: `Maximum price is ${offerConstants.Price.Max}`,
  },
  amenities: {
    invalid: `Field amenities must be an array and type must be ${formatsObjectToString(EAmenity)}`,
  },
  location: {
    invalid: 'Latitude and Longitude must be a valid number',
  },
  userId: {
    invalidId: 'Field userId must be a valid id',
  },
} as const;
