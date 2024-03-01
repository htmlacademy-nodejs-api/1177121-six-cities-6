import { Request } from 'express';
import { TRequestBody } from '../../../libs/rest/index.js';
import { UpdateOfferDto } from '../dto/update-offer.dto.js';
import { TParamOfferId } from './param-offerid.type.js';

export type TUpdateOfferRequest = Request<TParamOfferId, TRequestBody, UpdateOfferDto>;
