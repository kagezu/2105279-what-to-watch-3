import { DocumentType } from '@typegoose/typegoose';
import SwitchFavoriteDto from './dto/switch-favorite.dto.js';
import { FavoriteEntity } from './favorite.entity.js';

export interface FavoriteServiceInterface {
  create(dto: SwitchFavoriteDto): Promise<void>;
  delete(dto: SwitchFavoriteDto): Promise<void>;
  deleteAll(filmId: string): Promise<void>;
  index(user: string): Promise<DocumentType<FavoriteEntity>[]>;
  exists(dto: SwitchFavoriteDto): Promise<boolean>
}
