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
import { offerConstants } from '../../../constants/index.js';
import { CreateOfferValidationMessage } from './offer.messages.js';

export class CreateOfferDto {
  @MinLength(offerConstants.TitleLength.Min, {
    message: CreateOfferValidationMessage.title.minLength,
  })
  @MaxLength(offerConstants.TitleLength.Max, {
    message: CreateOfferValidationMessage.title.maxLength,
  })
  public title: string;

  @MinLength(offerConstants.DescriptionLength.Min, {
    message: CreateOfferValidationMessage.description.minLength,
  })
  @MaxLength(offerConstants.DescriptionLength.Max, {
    message: CreateOfferValidationMessage.description.maxLength,
  })
  public description: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: CreateOfferValidationMessage.postDate.invalidFormat }
  )
  public postDate: Date;

  @IsEnum(ECity, {
    message: CreateOfferValidationMessage.city.invalid,
  })
  public city: ECity;

  @Matches(offerConstants.IMAGE_REGEX, {
    message: CreateOfferValidationMessage.preview.matches,
  })
  public preview: string;

  @IsArray({ message: CreateOfferValidationMessage.photos.invalidFormat })
  @ArrayMinSize(offerConstants.PhotosArrayLength.Min, {
    message: CreateOfferValidationMessage.photos.ArrayMinSize,
  })
  @ArrayMaxSize(offerConstants.PhotosArrayLength.Max, {
    message: CreateOfferValidationMessage.photos.ArrayMaxSize,
  })
  public photos: string[];

  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium: boolean;

  @IsEnum(EHouseType, {
    message: CreateOfferValidationMessage.houseType.invalid,
  })
  public houseType: EHouseType;

  @IsInt({ message: CreateOfferValidationMessage.roomsCount.invalidFormat })
  @Min(offerConstants.RoomCount.Min, {
    message: CreateOfferValidationMessage.roomsCount.minValue,
  })
  @Max(offerConstants.RoomCount.Max, {
    message: CreateOfferValidationMessage.roomsCount.maxValue,
  })
  public roomsCount: number;

  @IsInt({ message: CreateOfferValidationMessage.guestsCount.invalidFormat })
  @Min(offerConstants.GuestCount.Min, {
    message: CreateOfferValidationMessage.guestsCount.minValue,
  })
  @Max(offerConstants.GuestCount.Max, {
    message: CreateOfferValidationMessage.guestsCount.maxValue,
  })
  public guestsCount: number;

  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: CreateOfferValidationMessage.price.minValue })
  @Max(100000, { message: CreateOfferValidationMessage.price.maxValue })
  public price: number;

  @IsArray({ message: CreateOfferValidationMessage.amenities.invalid })
  @IsIn(Object.values(EAmenity), {
    each: true,
    message: CreateOfferValidationMessage.amenities.invalid,
  })
  public amenities: EAmenity[];

  @IsMongoId({ message: CreateOfferValidationMessage.userId.invalidId })
  public userId: string;

  @ValidateNested()
  public location: TLocation;
}
