import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
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

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(offerConstants.TitleLength.Min, {
    message: CreateOfferValidationMessage.title.minLength,
  })
  @MaxLength(offerConstants.TitleLength.Max, {
    message: CreateOfferValidationMessage.title.maxLength,
  })
  public title?: string;

  @IsOptional()
  @MinLength(offerConstants.DescriptionLength.Min, {
    message: CreateOfferValidationMessage.description.minLength,
  })
  @MaxLength(offerConstants.DescriptionLength.Max, {
    message: CreateOfferValidationMessage.description.maxLength,
  })
  public description?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: CreateOfferValidationMessage.postDate.invalidFormat }
  )
  public postDate?: Date;

  @IsOptional()
  @IsEnum(ECity, {
    message: CreateOfferValidationMessage.city.invalid,
  })
  public city?: ECity;

  @IsOptional()
  @Matches(offerConstants.IMAGE_REGEX, {
    message: CreateOfferValidationMessage.preview.matches,
  })
  public preview?: string;

  @IsOptional()
  @IsArray({ message: CreateOfferValidationMessage.photos.invalidFormat })
  @ArrayMinSize(offerConstants.PhotosArrayLength.Min, {
    message: CreateOfferValidationMessage.photos.ArrayMinSize,
  })
  @ArrayMaxSize(offerConstants.PhotosArrayLength.Max, {
    message: CreateOfferValidationMessage.photos.ArrayMaxSize,
  })
  public photos?: string[];

  @IsOptional()
  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(EHouseType, {
    message: CreateOfferValidationMessage.houseType.invalid,
  })
  public houseType?: EHouseType;

  @IsOptional()
  @IsInt({ message: CreateOfferValidationMessage.roomsCount.invalidFormat })
  @Min(offerConstants.RoomCount.Min, {
    message: CreateOfferValidationMessage.roomsCount.minValue,
  })
  @Max(offerConstants.RoomCount.Max, {
    message: CreateOfferValidationMessage.roomsCount.maxValue,
  })
  public roomsCount?: number;

  @IsOptional()
  @IsInt({ message: CreateOfferValidationMessage.guestsCount.invalidFormat })
  @Min(offerConstants.GuestCount.Min, {
    message: CreateOfferValidationMessage.guestsCount.minValue,
  })
  @Max(offerConstants.GuestCount.Max, {
    message: CreateOfferValidationMessage.guestsCount.maxValue,
  })
  public guestsCount?: number;

  @IsOptional()
  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  @Min(offerConstants.Price.Min, {
    message: CreateOfferValidationMessage.price.minValue,
  })
  @Max(offerConstants.Price.Max, {
    message: CreateOfferValidationMessage.price.maxValue,
  })
  public price?: number;

  @IsOptional()
  @IsArray({ message: CreateOfferValidationMessage.amenities.invalid })
  @IsIn(Object.values(EAmenity), {
    each: true,
    message: CreateOfferValidationMessage.amenities.invalid,
  })
  public amenities?: EAmenity[];

  @IsOptional()
  @ValidateNested()
  public location?: TLocation;
}
