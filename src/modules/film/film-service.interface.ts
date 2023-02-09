import { DocumentType } from '@typegoose/typegoose';
import CreateFilmDto from './dto/create-film.dto.js';
import UpdateFilmDto from './dto/update-film.dto.js';
import { FilmEntity } from './film.entity.js';
import { DocumentExistsInterface } from '../../types/document-exists.interface.js';

export interface FilmServiceInterface extends DocumentExistsInterface {

  /** Добавление новой карточки с фильмом*/
  create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>>;

  /** Редактирование карточки фильма*/
  update(filmId: string, dto: UpdateFilmDto): Promise<DocumentType<FilmEntity> | null>;

  /** Удаление карточки фильма*/
  delete(filmId: string): Promise<DocumentType<FilmEntity> | null>;

  /** Получение списка фильмов*/
  index(): Promise<DocumentType<FilmEntity>[]>;

  /** Получение списка фильмов определённого жанра*/
  findByGenre(genre: string, count?: number): Promise<DocumentType<FilmEntity>[]>;

  /** Получение детальной информации по фильму*/
  show(filmId: string): Promise<DocumentType<FilmEntity> | null>;

  /** Получение промо - фильма*/
  promo(): Promise<DocumentType<FilmEntity> | null>;

  /** Увеличение счётчика комментариев*/
  incCommentCount(FilmId: string): Promise<DocumentType<FilmEntity> | null>;

  /** Расчетать и обновить рейтинг для определённого фильма*/
  updateRatingByFilmId(filmId: string, newGrade: number): Promise<number | undefined>;
}
