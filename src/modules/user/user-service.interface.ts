import { DocumentType } from '@typegoose/typegoose';
// import { FilmEntity } from '../film/film.entity.js';
import CreateUserDto from './dto/create-user.dto.js';
import { UserEntity } from './user.entity.js';

export interface UserServiceInterface {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findById(id: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;

  /** Получить список фильмов «К просмотру»*/
  // findFavoriteByEmail(email: string): Promise<DocumentType<FilmEntity>[]>;

  /** Добавить/удалить фильм из списка «К просмотру»*/
  // updateFavoriteByEmail(email: string, filmId: string, status: boolean): Promise<DocumentType<FilmEntity>[]>;
}
