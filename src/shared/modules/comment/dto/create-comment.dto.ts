import { IsInt, IsMongoId, IsString, Length, Max, Min } from 'class-validator';
import { commentConstants, offerConstants } from '../../../constants/index.js';
import { CommentMessages } from './comment.messages.js';

export class CreateCommentDto {
  @IsString({ message: CommentMessages.text.invalidFormat })
  @Length(commentConstants.TextLength.Min, commentConstants.TextLength.Max, {
    message: CommentMessages.text.lengthField,
  })
  public text: string;

  @IsInt({ message: CommentMessages.rating.invalidFormat })
  @Min(offerConstants.Rating.Min, {
    message: CommentMessages.rating.minValue,
  })
  @Max(offerConstants.Rating.Max, {
    message: CommentMessages.rating.maxValue,
  })
  public rating: number;

  @IsMongoId({message: CommentMessages.offerId.invalidFormat})
  public offerId: string;

  @IsMongoId({message: CommentMessages.userId.invalidFormat})
  public userId: string;
}
