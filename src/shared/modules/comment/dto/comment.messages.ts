import { commentConstants, offerConstants } from '../../../constants/index.js';

export const CommentMessages = {
  text: {
    invalidFormat: 'Text is required',
    lengthField: `Min length is ${commentConstants.TextLength.Min}, max is ${commentConstants.TextLength.Max}`,
  },
  rating: {
    invalidFormat: 'Rating must be an integer',
    minValue: `Min length for rating path is ${offerConstants.Rating.Min}`,
    maxValue: `Max length for rating path is ${offerConstants.Rating.Max}`,
  },
  offerId: {
    invalidFormat: 'Field offerId must be a valid id',
  },
  userId: {
    invalidFormat: 'Field userId must be a valid id',
  },
} as const;
