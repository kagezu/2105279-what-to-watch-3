import { Expose, Type } from 'class-transformer';
import FilmResponse from '../../film/response/film.response.js';

export default class FavoriteResponse {
  @Expose()
  @Type(() => FilmResponse)
  public film!: FilmResponse;
}
