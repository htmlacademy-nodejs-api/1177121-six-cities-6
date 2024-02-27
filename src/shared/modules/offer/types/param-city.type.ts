import { ParamsDictionary } from 'express-serve-static-core';
import { ECity } from '../../../types/index.js';

export type TParamCity = {
  city: ECity;
} | ParamsDictionary;
