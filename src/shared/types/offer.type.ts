import { EAmenity } from './amenity.enum.js';
import { ECity } from './city.enum.js';
import { EHouseType } from './house-type.enum.js';
import { TLocation } from './location.type.js';
import { TUser } from './user.type.js';

export type TOffer = {
  title: string;
  description: string;
  postDate: Date;
  city: ECity;
  preview: string;
  photos: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  houseType: EHouseType;
  roomsCount: number;
  guestsCount: number;
  price: number;
  amenities: EAmenity[];
  author: TUser;
  commentCount: number,
  location: TLocation;
};
