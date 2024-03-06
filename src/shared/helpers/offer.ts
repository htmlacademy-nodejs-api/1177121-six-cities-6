import {
  EAmenity,
  ECity,
  EHouseType,
  EUserType,
  TOffer,
} from '../types/index.js';
import { DECIMAL_SYSTEM } from '../constants/index.js';

export const createOffer = (offerData: string): TOffer => {
  const [
    title,
    description,
    createdDate,
    city,
    preview,
    photos,
    isPremium,
    houseType,
    roomsCount,
    guestsCount,
    price,
    amenities,
    name,
    email,
    avatar,
    userType,
    latitude,
    longitude,
  ] = offerData.replace('\n', '').split('\t');

  return {
    title,
    description,
    postDate: new Date(createdDate),
    city: ECity[city as keyof typeof ECity],
    preview,
    photos: photos.split(';'),
    isPremium: JSON.parse(isPremium),
    houseType: EHouseType[houseType as keyof typeof EHouseType],
    roomsCount: Number.parseInt(roomsCount, DECIMAL_SYSTEM),
    guestsCount: Number.parseInt(guestsCount, DECIMAL_SYSTEM),
    price: Number.parseInt(price, DECIMAL_SYSTEM),
    amenities: amenities.split(';').map((amenity) => amenity as EAmenity),
    author: {
      name,
      email,
      avatar,
      userType: EUserType[userType as keyof typeof EUserType],
    },
    location: {
      latitude: Number.parseFloat(latitude),
      longitude: Number.parseFloat(longitude),
    },
  };
};
