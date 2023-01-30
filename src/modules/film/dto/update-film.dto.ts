import { Genre } from '../../../types/genre.type.js';

export default class UpdateFilmDto {
  name?: string;
  description?: string;
  publicationDate?: string;
  genre?: Genre;
  released?: string;
  previewVideoLink?: string;
  videoLink?: string;
  actors?: string[];
  producer?: string;
  runTime?: number;
  posterImage?: string;
  backgroundImage?: string;
  color?: string;
  rating?: number;
}
