export enum Genre {
  Comedy = 'comedy',
  Crime = 'crime',
  Documentary = 'documentary',
  Drama = 'drama',
  Horror = 'horror',
  Family = 'family',
  Romance = 'romance',
  Scifi = 'scifi',
  Thriller = 'thriller'
}

export type Film = {
  name: string;
  description: string;
  publicationDate: string;
  genre: Genre;
  released: string;
  rating: number;
  previewVideoLink: string;
  videoLink: string;
  actors: string[];
  producer: string;
  runTime: number;
  commentAmount: number;
  // userId: string;
  posterImage: string;
  backgroundImage: string;
  color: string;
};
