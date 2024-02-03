import { Schema, Document, model } from 'mongoose';
import { TUser } from '../../types/index.js';

export interface IUserDocument extends TUser, Document {}

const userSchema = new Schema({
  name: String,
  email: String,
  avatar: String,
  userType: String,
});

export const UserModel = model<IUserDocument>('User', userSchema);
