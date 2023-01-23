import dayjs from 'dayjs';
import { MockData } from '../../types/mock-data.type.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../utils/random.js';
import { FilmGeneratorInterface } from './film-generator.interface.js';

const OLD_YEAR = 20;
const MAX_RATING = 10;
const RATING_DECIMAL = 1;
const MIN_RUN_TIME = 80;
const MAX_RUN_TIME = 150;
const MAX_AMOUNT_COMMENT = 30;

export default class FilmGenerator implements FilmGeneratorInterface {
  constructor(private readonly mockData: MockData) { }

  public generate(): string {
    const name = getRandomItem<string>(this.mockData.names);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const publicationDate = dayjs().toString();
    const genre = getRandomItem<string>(this.mockData.genres);
    const released = dayjs().subtract(generateRandomValue(0, OLD_YEAR), 'year').format('YYYY');
    const rating = generateRandomValue(0, MAX_RATING, RATING_DECIMAL);
    const previewVideoLink = getRandomItem<string>(this.mockData.previewVideoLinks);
    const videoLink = getRandomItem<string>(this.mockData.videoLinks);
    const actors = getRandomItems<string>(this.mockData.actors).join(',');
    const producer = getRandomItem<string>(this.mockData.producers);
    const runTime = generateRandomValue(MIN_RUN_TIME, MAX_RUN_TIME);
    const commentAmount = generateRandomValue(0, MAX_AMOUNT_COMMENT);
    const posterImage = getRandomItem<string>(this.mockData.posterImages);
    const backgroundImage = getRandomItem<string>(this.mockData.backgroundImages);
    const color = getRandomItem<string>(this.mockData.colors);

    const user = getRandomItem<string>(this.mockData.actors).split(' ')[0];
    const email = getRandomItem<string>(this.mockData.email);
    const avatarPath = getRandomItem<string>(this.mockData.avatars);

    return [
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
    ].join('\t');
  }
}
