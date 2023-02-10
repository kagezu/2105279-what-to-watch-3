import { DocumentType } from '@typegoose/typegoose';
import CreateFavoriteDto from './dto/create-favorite.dto.js';
import DeleteFavoriteDto from './dto/delete-favorite.dto.js';
import { FavoriteEntity } from './favorite.entity.js';

export interface FavoriteServiceInterface {
  create(dto: CreateFavoriteDto): Promise<void>;
  delete(dto: DeleteFavoriteDto): Promise<void>;
  deleteAll(filmId: string): Promise<void>;
  index(user: string): Promise<DocumentType<FavoriteEntity>[]>;
}
