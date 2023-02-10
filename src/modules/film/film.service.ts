import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { FilmEntity } from './film.entity.js';
import CreateFilmDto from './dto/create-film.dto.js';
import { FilmServiceInterface } from './film-service.interface.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.types.js';
import UpdateFilmDto from './dto/update-film.dto.js';
import { ConfigInterface } from '../../common/config/config.interface.js';

@injectable()
export default class FilmService implements FilmServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.FilmModel) private readonly filmModel: types.ModelType<FilmEntity>,
    @inject(Component.ConfigInterface) private readonly configService: ConfigInterface
  ) { }

  public async create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>> {
    const result = await this.filmModel.create(dto);
    this.logger.info(`New film created: ${dto.name}`);
    return result;
  }

  public async update(filmId: string, dto: UpdateFilmDto): Promise<DocumentType<FilmEntity> | null> {
    return await this.filmModel
      .findByIdAndUpdate(filmId, dto, { new: true })
      .populate('user')
      .exec();
  }

  public async delete(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndDelete(filmId)
      .exec();
  }

  public async index(count?: number): Promise<DocumentType<FilmEntity>[]> {
    const limit = count ? count : this.configService.get('DEFAULT_FILM_COUNT_LIMIT');
    return this.filmModel
      .find()
      .limit(limit)
      .populate('user')
      .exec();
  }

  public async findByGenre(genre: string, count?: number): Promise<DocumentType<FilmEntity>[]> {
    const limit = count ? count : this.configService.get('DEFAULT_FILM_COUNT_LIMIT');
    return this.filmModel
      .find({ genre }, {}, { limit })
      .populate('user')
      .exec();
  }

  public async show(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findById(filmId)
      .populate('user')
      .exec();
  }

  public async promo(): Promise<DocumentType<FilmEntity> | null> {
    const result = await this.filmModel
      .find({ isPromo: true }, {}, { limit: 1 })
      .populate('user')
      .exec();
    return result[0];
  }

  public async updateRating(filmId: string, newGrade: number): Promise<number | undefined> {
    const result = await this.filmModel
      .findById(filmId)
      .exec();
    if (!result) {
      return;
    }

    const newRating = (result.rating * result.commentAmount + +newGrade) / (result.commentAmount + 1);
    await this.filmModel
      .findByIdAndUpdate(filmId, {
        rating: newRating,
        '$inc': {
          commentAmount: 1,
        }
      });

    return newRating;
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.filmModel
      .exists({ _id: documentId })) !== null;
  }
}
