import { Request } from 'express';
import { TRequestParams, TRequestQuery } from '../../../libs/rest/index.js';

export type TFindOfferRequest = Request<TRequestParams, unknown, unknown, TRequestQuery>;
