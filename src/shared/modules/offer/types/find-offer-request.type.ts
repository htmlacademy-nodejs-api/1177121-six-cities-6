import { Request } from 'express';
import { TRequestQuery } from '../../../libs/rest/index.js';
import { TParamOfferId } from './param-offerid.type.js';

export type TOfferRequest = Request<TParamOfferId, unknown, unknown, TRequestQuery>;
