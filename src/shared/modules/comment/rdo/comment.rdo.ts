import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../../user/index.js';

export class CommentRdo {
  @Expose({ name: '_id' })
  public id: string;

  @Expose()
  public text: string;

  @Expose()
  public rating: number;

  @Expose({ name: 'createdAt'})
  public postDate: string;

  @Expose()
  public offerId: string;

  @Expose({ name: 'userId' })
  @Type(() => UserRdo)
  public author: UserRdo;
}
