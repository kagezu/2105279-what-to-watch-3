import { Genre } from '../../../types/genre.type.js';

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
  user!: string;
  posterImage!: string;
  backgroundImage!: string;
  color!: string;
}
