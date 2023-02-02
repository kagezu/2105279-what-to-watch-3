import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { FilmEntity } from './film.entity.js';
import CreateFilmDto from './dto/create-film.dto.js';
import { FilmServiceInterface } from './film-service.interface.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.types.js';
import UpdateFilmDto from './dto/update-film.dto.js';
import { DEFAULT_FILM_COUNT } from './film.constant.js';
import { Genre } from '../../types/genre.type.js';

const PROMO_ID = '63d8c73560a8064cd4514e23';

@injectable()
export default class FilmService implements FilmServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.FilmModel) private readonly filmModel: types.ModelType<FilmEntity>
  ) { }

  public async create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>> {
    const result = await this.filmModel.create(dto);
    this.logger.info(`New film created: ${dto.name}`);

    return result;
  }

  public async updateById(filmId: string, dto: UpdateFilmDto): Promise<DocumentType<FilmEntity> | null> {
    return await this.filmModel
      .findByIdAndUpdate(filmId, dto, { new: true })
      .populate('user')
      .exec();
  }

  public async deleteById(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndDelete(filmId)
      .exec();
  }

  public async find(): Promise<DocumentType<FilmEntity>[]> {
    return this.filmModel
      .find()
      .limit(10)
      .populate('user')
      .exec();
  }

  public async findByGenre(genre: Genre, count?: number): Promise<DocumentType<FilmEntity>[]> {
    const limit = count ?? DEFAULT_FILM_COUNT;
    return this.filmModel
      .find({ genre }, {}, { limit })
      .populate('user')
      .exec();
  }

  public async findById(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findById(filmId)
      .populate('user')
      .exec();
  }

  public async findPromo(): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findById(PROMO_ID)
      .populate('user')
      .exec();
  }

  public async incCommentCount(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndUpdate(filmId, {
        '$inc': {
          commentCount: 1,
        }
      }).exec();
  }

  public async updateRatingByFilmId(filmId: string, newGrade: number): Promise<number | undefined> {
    const result = await this.filmModel
      .findById(filmId)
      .exec();
    if (!result) {
      return;
    }
    const newRating = (result.rating * result.commentAmount + newGrade) / (result.commentAmount + 1);

    await this.updateById(filmId, {
      rating: newRating
    });

    return newRating;
  }
}
