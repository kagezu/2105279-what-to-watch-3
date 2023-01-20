import { User } from './user.type.js';

export type Comment = {
  text: string;
  rating: number;
  released: string;
  author: User;
}
