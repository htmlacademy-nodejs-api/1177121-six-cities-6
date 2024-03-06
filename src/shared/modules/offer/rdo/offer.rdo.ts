import { Expose, Type } from 'class-transformer';
import { EAmenity, ECity, EHouseType } from '../../../types/index.js';
import { UserRdo } from '../../user/index.js';

class LocationRdo {
  @Expose()
  public latitude: number;

  @Expose()
  public longitude: number;
}

export class OfferRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public postDate: Date;

  @Expose()
  public city: ECity;

  @Expose()
  public preview: string;

  @Expose()
  public photos: string[];

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public houseType: EHouseType;

  @Expose()
  public roomsCount: number;

  @Expose()
  public guestsCount: number;

  @Expose()
  public price: number;

  @Expose()
  public amenities: EAmenity[];

  @Expose()
  public commentCount: number;

  @Expose({ name: 'userId' })
  @Type(() => UserRdo)
  public author: UserRdo;

  @Expose()
  @Type(() => LocationRdo)
  public location: LocationRdo;
}
