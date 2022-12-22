export enum Genre {
  comedy, crime, documentary, drama, horror, family, romance, scifi, thriller
}

export type Film = {
  id: number;
  name: string;
  description: string;
  publicationDate: string;
  genre: Genre;
  released: number;
  rating: number;
  previewVideoLink: string;
  videoLink: string;
  actors: string[];
  producer: string;
  runTime: number;
  commentAmount: number;
  userId: number;
  posterImage: string;
  backgroundImage: string;
  color: string;
};
