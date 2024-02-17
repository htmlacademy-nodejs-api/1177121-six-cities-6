import { EAmenity, ECity, EHouseType, TLocation } from '../../../types/index.js';

export class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public postDate?: Date;
  public city?: ECity;
  public preview?: string;
  public photos?: string[];
  public isPremium?: boolean;
  public houseType?: EHouseType;
  public roomsCount?: number;
  public guestsCount?: number;
  public price?: number;
  public amenities?: EAmenity[];
  public location?: TLocation;
}
