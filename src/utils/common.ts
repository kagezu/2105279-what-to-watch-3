
import { Genre, Film } from '../types/film.type.js';

export const createFilm = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [id, name, description, publicationDate, genre, released, rating, previewVideoLink, videoLink, actors, producer, runTime, commentAmount, userId, posterImage, backgroundImage, color] = tokens;

  return {
    id: Number(id),
    name,
    description,
    publicationDate,
    genre: genre as unknown as Genre,
    released,
    rating: Number(rating),
    previewVideoLink,
    videoLink,
    actors: actors.split(','),
    producer,
    runTime: Number(runTime),
    commentAmount: Number(commentAmount),
    userId: Number(userId),
    posterImage,
    backgroundImage,
    color
  } as Film;
};

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';
