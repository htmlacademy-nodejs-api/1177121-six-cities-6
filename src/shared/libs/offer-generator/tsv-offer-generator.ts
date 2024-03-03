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
import { DAY_UNIT, offerConstants } from '../../constants/index.js';
import { IOfferGenerator } from './offer-generator.interface.js';

export class TSVOfferGenerator implements IOfferGenerator {
  constructor(private readonly mockData: TMockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const createdDate = dayjs()
      .subtract(
        generateRandomValue(
          offerConstants.WeekDay.First,
          offerConstants.WeekDay.Last
        ),
        DAY_UNIT
      )
      .toISOString();
    const city = getRandomItem(
      Object.keys(offerConstants.Cities)
    ) as keyof typeof offerConstants.Cities;
    const preview = getRandomItem<string>(this.mockData.previews);
    const photos = getRandomItems<string>(this.mockData.photos).join(';');
    const isPremium = getRandomItem([
      offerConstants.BooleanString.True,
      offerConstants.BooleanString.False,
    ]);
    const houseType = getRandomItem(Object.values(EHouseType));
    const roomsCount = generateRandomValue(
      offerConstants.RoomCount.Min,
      offerConstants.RoomCount.Max
    );
    const guestsCount = generateRandomValue(
      offerConstants.GuestCount.Min,
      offerConstants.GuestCount.Max
    );
    const price = generateRandomValue(
      offerConstants.Price.Min,
      offerConstants.Price.Max
    );
    const amenities = getRandomItems(Object.values(EAmenity)).join(';');
    const name = getRandomItem<string>(this.mockData.names);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatar = getRandomItem<string>(this.mockData.avatars);
    const userType = getRandomItem(Object.values(EUserType));
    const commentCount = generateRandomValue(
      offerConstants.CommentCount.Min,
      offerConstants.CommentCount.Max
    );
    const latitude = offerConstants.Cities[city].latitude;
    const longitude = offerConstants.Cities[city].longitude;

    return [
      title,
      description,
      createdDate,
      city,
      preview,
      photos,
      isPremium,
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
