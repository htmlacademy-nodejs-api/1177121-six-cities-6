import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsMongoId,
  IsOptional,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  EAmenity,
  ECity,
  EHouseType,
  TLocation,
} from '../../../types/index.js';
import { IMAGE_REGEX, offerConstants } from '../../../constants/index.js';
import { OfferValidationMessage } from './offer.messages.js';

export class CreateOfferDto {
  @MinLength(offerConstants.TitleLength.Min, {
    message: OfferValidationMessage.title.minLength,
  })
  @MaxLength(offerConstants.TitleLength.Max, {
    message: OfferValidationMessage.title.maxLength,
  })
  public title: string;

  @MinLength(offerConstants.DescriptionLength.Min, {
    message: OfferValidationMessage.description.minLength,
  })
  @MaxLength(offerConstants.DescriptionLength.Max, {
    message: OfferValidationMessage.description.maxLength,
  })
  public description: string;

  @IsOptional()
  @IsDateString({}, { message: OfferValidationMessage.postDate.invalidFormat })
  public postDate: Date;

  @IsEnum(ECity, {
    message: OfferValidationMessage.city.invalid,
  })
  public city: ECity;

  @Matches(IMAGE_REGEX, {
    message: OfferValidationMessage.preview.matches,
  })
  public preview: string;

  @IsArray({ message: OfferValidationMessage.photos.invalidFormat })
  @ArrayMinSize(offerConstants.PhotosArrayLength.Min, {
    message: OfferValidationMessage.photos.ArrayMinSize,
  })
  @ArrayMaxSize(offerConstants.PhotosArrayLength.Max, {
    message: OfferValidationMessage.photos.ArrayMaxSize,
  })
  public photos: string[];

  @IsBoolean({ message: OfferValidationMessage.isPremium.invalidFormat })
  public isPremium: boolean;

  @IsEnum(EHouseType, {
    message: OfferValidationMessage.houseType.invalid,
  })
  public houseType: EHouseType;

  @IsInt({ message: OfferValidationMessage.roomsCount.invalidFormat })
  @Min(offerConstants.RoomCount.Min, {
    message: OfferValidationMessage.roomsCount.minValue,
  })
  @Max(offerConstants.RoomCount.Max, {
    message: OfferValidationMessage.roomsCount.maxValue,
  })
  public roomsCount: number;

  @IsInt({ message: OfferValidationMessage.guestsCount.invalidFormat })
  @Min(offerConstants.GuestCount.Min, {
    message: OfferValidationMessage.guestsCount.minValue,
  })
  @Max(offerConstants.GuestCount.Max, {
    message: OfferValidationMessage.guestsCount.maxValue,
  })
  public guestsCount: number;

  @IsInt({ message: OfferValidationMessage.price.invalidFormat })
  @Min(offerConstants.Price.Min, {
    message: OfferValidationMessage.price.minValue,
  })
  @Max(offerConstants.Price.Max, {
    message: OfferValidationMessage.price.maxValue,
  })
  public price: number;

  @IsArray({ message: OfferValidationMessage.amenities.invalid })
  @IsIn(Object.values(EAmenity), {
    each: true,
    message: OfferValidationMessage.amenities.invalid,
  })
  public amenities: EAmenity[];

  @IsMongoId({ message: OfferValidationMessage.userId.invalidId })
  public userId: string;

  @ValidateNested({ message: OfferValidationMessage.location.invalid })
  public location: TLocation;
}
