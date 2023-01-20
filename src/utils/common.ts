import crypto from 'crypto';
import { Film } from '../types/film.type.js';

export const createFilm = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [
    name,
    description,
    publicationDate,
    genre,
    released,
    rating,
    previewVideoLink,
    videoLink,
    actors,
    producer,
    runTime,
    commentAmount,
    posterImage,
    backgroundImage,
    color,
    user,
    email,
    avatarPath
  ] = tokens;

  return {
    name,
    description,
    publicationDate,
    genre,
    released,
    rating: Number(rating),
    previewVideoLink,
    videoLink,
    actors: actors.split(','),
    producer,
    runTime: Number(runTime),
    commentAmount: Number(commentAmount),
    posterImage,
    backgroundImage,
    color,
    user: {
      name: user,
      email,
      avatarPath
    }
  } as Film;
};

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};
