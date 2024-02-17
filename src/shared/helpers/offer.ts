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
    isFavorite,
    rating,
    houseType,
    roomsCount,
    guestsCount,
    price,
    amenities,
    name,
    email,
    avatar,
    userType,
    commentCount,
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
    isFavorite: JSON.parse(isFavorite),
    rating: Number.parseFloat(rating),
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
    commentCount: Number.parseInt(commentCount, DECIMAL_SYSTEM),
    location: {
      latitude: Number.parseFloat(latitude),
      longitude: Number.parseFloat(longitude),
    },
  };
};
