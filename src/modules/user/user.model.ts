import mongoose from 'mongoose';
import { User } from '../../types/user.type.js';

export interface UserDocument extends User, mongoose.Document {
  createdAt: Date,
  updatedAt: Date,
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect'],
  },
  avatarPath: {
    type: String,
    match: [/\.(?:jpg||png)$/, 'Format is incorrect'],
  },
  name: {
    type: String,
    required: true,
    minlength: [1, 'Min length for firstname is 1'],
    maxlength: [15, 'Max length for firstname is 15'],
  },
}, {
  timestamps: true,
});

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
