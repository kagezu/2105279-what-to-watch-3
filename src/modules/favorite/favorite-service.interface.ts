import CreateFavoriteDto from './dto/create-favorite.dto.js';
import DeleteFavoriteDto from './dto/delete-favorite.dto.js';

export interface FavoriteServiceInterface {
  create(dto: CreateFavoriteDto): Promise<void>;
  delete(dto: DeleteFavoriteDto): Promise<void>;
}
