import { User } from './user.type.js';

export type Comment = {
  id: number;
  text: string;
  rating: number;
  released: string;
  author: User;
}
