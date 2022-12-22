import { readFileSync } from 'fs';
import { FileReaderInterface } from './file-reader.interface.js';

import { Genre, Film } from '../../types/film.type.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) { }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf8' });
  }

  public toArray(): Film[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split(','))
      .map(([id, name, description, publicationDate, genre, released, rating, previewVideoLink, videoLink, actors, producer, runTime, userId, posterImage, backgroundImage, color]) => ({
        id: Number(id),
        name,
        description,
        publicationDate,
        genre: genre as unknown as Genre,
        released: Number(released),
        rating: Number(rating),
        previewVideoLink,
        videoLink,
        actors: actors.split('\t'),
        producer,
        runTime: Number(runTime),
        commentAmount: 0,
        userId: Number(userId),
        posterImage,
        backgroundImage,
        color
      }));
  }
}
