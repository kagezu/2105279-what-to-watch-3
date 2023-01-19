import { Film } from '../../types/film.type.js';
import { Genre } from '../../types/film.type.js';
import typegoose, { getModelForClass, defaultClasses, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity.js';

const { prop, modelOptions } = typegoose;

const enum FilmOption {
  MinLengthName = 2,
  MaxLengthName = 100,
  MinLengthDescription = 20,
  MaxLengthDescription = 1024,
  MinLengthProducerName = 2,
  MaxLengthProducerName = 50,
  DefaultColor = '#000000'
}

export interface FilmEntity extends defaultClasses.Base { }

@modelOptions({
  schemaOptions: {
    collection: 'films'
  }
})
export class FilmEntity extends defaultClasses.TimeStamps {
  constructor(data: Film) {
    super();

    this.name = data.name;
    this.description = data.description;
    this.publicationDate = data.publicationDate;
    this.genre = data.genre;
    this.released = data.released;
    this.rating = data.rating;
    this.previewVideoLink = data.previewVideoLink;
    this.videoLink = data.videoLink;
    this.actors = data.actors;
    this.producer = data.producer;
    this.runTime = data.runTime;
    this.commentAmount = data.commentAmount;
    this.posterImage = data.posterImage;
    this.backgroundImage = data.backgroundImage;
    this.color = data.color;
  }

  @prop({
    trim: true,
    required: true,
    default: '',
    minlength: [FilmOption.MinLengthName, `Min length for name is ${FilmOption.MinLengthName}`],
    maxlength: [FilmOption.MaxLengthName, `Max length for name is ${FilmOption.MaxLengthName}`]
  })
  public name!: string;

  @prop({
    trim: true,
    required: true,
    default: '',
    minlength: [FilmOption.MinLengthDescription, `Min length for description is ${FilmOption.MinLengthDescription}`],
    maxlength: [FilmOption.MaxLengthDescription, `Max length for description is ${FilmOption.MaxLengthDescription}`]
  })
  public description!: string;

  @prop({
    required: true,
    default: new Date
  })
  public publicationDate!: string;

  @prop({
    type: () => String,
    enum: Genre
  })
  public genre!: Genre;

  @prop({
    required: true
  })
  public released!: string;

  @prop({
    required: true,
    default: 0
  })
  public rating!: number;

  @prop({
    required: true,
    default: ''
  })
  public previewVideoLink!: string;

  @prop({
    required: true,
    default: ''
  })
  public videoLink!: string;

  @prop({
    required: true,
    default: []
  })
  public actors!: string[];

  @prop({
    required: true,
    default: '',
    minlength: [FilmOption.MinLengthProducerName, `Min length for producer is ${FilmOption.MinLengthProducerName}`],
    maxlength: [FilmOption.MaxLengthProducerName, `Max length for producer is ${FilmOption.MaxLengthProducerName}`]
  })
  public producer!: string;

  @prop({
    required: true
  })
  public runTime!: number;

  @prop({
    required: true,
    default: 0
  })
  public commentAmount!: number;

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({
    required: true,
    default: '',
    // match: [/\.(?:jpg)$/, 'jpg format only']
  })
  public posterImage!: string;

  @prop({
    // required: true,
    default: '',
    // match: [/\.(?:jpg)$/, 'jpg format only']
  })
  public backgroundImage!: string;

  @prop({
    required: true,
    default: FilmOption.DefaultColor
  })
  public color!: string;
}

export const FilmModel = getModelForClass(FilmEntity);
