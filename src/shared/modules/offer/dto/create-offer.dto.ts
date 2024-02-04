import { EAmenity, ECity, EHouseType, TLocation } from '../../../types/index.js';

export class CreateOfferDto {
  public title: string;
  public description: string;
  public postDate: Date;
  public city: ECity;
  public preview: string;
  public photos: string[];
  public isPremium: boolean;
  public isFavorite: boolean;
  public rating: number;
  public houseType: EHouseType;
  public roomsCount: number;
  public guestsCount: number;
  public price: number;
  public amenities: EAmenity[];
  public commentCount: number;
  public userId: string;
  public location: TLocation;
}
