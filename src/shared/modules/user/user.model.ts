import { Schema, Document, model } from 'mongoose';
import { TUser } from '../../types/index.js';

export interface IUserDocument extends TUser, Document {
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema({
  name: String,
  email: String,
  avatar: String,
  userType: String,
}, { timestamps: true });

export const UserModel = model<IUserDocument>('User', userSchema);
