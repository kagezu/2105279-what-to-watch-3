import { Genre } from '../../../types/film.type.js';

export default class CreateFilmDto {
  name!: string;
  description!: string;
  publicationDate!: string;
  genre!: Genre;
  released!: string;
  previewVideoLink!: string;
  videoLink!: string;
  actors!: string[];
  producer!: string;
  runTime!: number;
  commentAmount!: number;
  userId!: number;
  posterImage!: string;
  backgroundImage!: string;
  color!: string;
}
