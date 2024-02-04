import { Schema, Document, model } from 'mongoose';
import { EUserType, TUser } from '../../types/index.js';

export interface IUserDocument extends TUser, Document {
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [2, 'Min length for name is 2'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect'],
    },
    avatar: {
      type: String,
      required: false,
      match: [/\.(jpg|png)(\?.*)?$/i, 'The avatar image must match the format .jpg or .png']
    },
    userType: {
      type: String,
      required: true,
      enum: EUserType,
    },
  },
  { timestamps: true }
);

export const UserModel = model<IUserDocument>('User', userSchema);
