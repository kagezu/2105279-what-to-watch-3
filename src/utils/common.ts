import crypto from 'crypto';
import { Genre, Film } from '../types/film.type.js';

export const createFilm = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [name, description, publicationDate, genre, released, rating, previewVideoLink, videoLink, actors, producer, runTime, commentAmount, user, email, link, posterImage, backgroundImage, color] = tokens;

  return {
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
    userId: [user, email, link].join('\t'),
    posterImage,
    backgroundImage,
    color
  } as Film;
};

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};
