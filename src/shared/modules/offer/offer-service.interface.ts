import { DocumentType } from '@typegoose/typegoose';
import { IDocumentExists } from '../../types/index.js';
import { CreateOfferDto, UpdateOfferDto } from './dto/index.js';
import { OfferEntity } from './offer.entity.js';

export interface IOfferService extends IDocumentExists {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  find(): Promise<DocumentType<OfferEntity>[]>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findPremium(city: string): Promise<DocumentType<OfferEntity>[]>;
  findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]>;
  toggleFavorite(userId: string, offerId: string, isFavorite: boolean): Promise<boolean>;
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  exists(documentId: string): Promise<boolean>;
  isUser(userId: string, documentId: string): Promise<boolean>;
}
