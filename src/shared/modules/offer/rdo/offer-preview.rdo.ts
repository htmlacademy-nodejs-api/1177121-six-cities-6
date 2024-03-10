import { Expose } from 'class-transformer';
import { EAmenity, ECity, EHouseType } from '../../../types/index.js';

export class OfferPreviewRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title: string;

  @Expose()
  public postDate: Date;

  @Expose()
  public city: ECity;

  @Expose()
  public preview: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public houseType: EHouseType;

  @Expose()
  public price: number;

  @Expose()
  public amenities: EAmenity[];

  @Expose()
  public commentCount: number;
}
