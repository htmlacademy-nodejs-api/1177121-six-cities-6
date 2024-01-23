import dayjs from 'dayjs';
import {
  EAmenity,
  EHouseType,
  EUserType,
  TMockServerData,
} from '../../types/index.js';
import {
  generateRandomValue,
  getRandomItem,
  getRandomItems,
} from '../../helpers/index.js';
import {
  BooleanString,
  Cities,
  CommentCount,
  DAY_UNIT,
  GuestCount,
  Price,
  Rating,
  RoomCount,
  WeekDay,
} from '../../constants/index.js';
import { IOfferGenerator } from './offer-generator.interface.js';

export class TSVOfferGenerator implements IOfferGenerator {
  constructor(private readonly mockData: TMockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const createdDate = dayjs()
      .subtract(generateRandomValue(WeekDay.First, WeekDay.Last), DAY_UNIT)
      .toISOString();
    const city = getRandomItem(Object.keys(Cities)) as keyof typeof Cities;
    const preview = getRandomItem<string>(this.mockData.previews);
    const photos = getRandomItems<string>(this.mockData.photos);
    const isPremium = getRandomItem([BooleanString.True, BooleanString.False]);
    const isFavorite = getRandomItem([BooleanString.True, BooleanString.False]);
    const rating = generateRandomValue(Rating.Min, Rating.Max);
    const houseType = getRandomItem(Object.values(EHouseType));
    const roomsCount = generateRandomValue(RoomCount.Min, RoomCount.Max);
    const guestsCount = generateRandomValue(GuestCount.Min, GuestCount.Max);
    const price = generateRandomValue(Price.Min, Price.Max);
    const amenities = getRandomItems(Object.values(EAmenity));
    const name = getRandomItem<string>(this.mockData.names);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatar = getRandomItem<string>(this.mockData.avatars);
    const userType = getRandomItem(Object.values(EUserType));
    const commentCount = generateRandomValue(
      CommentCount.Min,
      CommentCount.Max
    );
    const latitude = Cities[city].latitude;
    const longitude = Cities[city].longitude;

    return [
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
    ].join('\t');
  }
}
