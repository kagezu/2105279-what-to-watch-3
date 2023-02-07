import typegoose, { getModelForClass, defaultClasses, Ref } from '@typegoose/typegoose';
import { FilmEntity } from '../film/film.entity.js';
import { UserEntity } from '../user/user.entity.js';

const { prop, modelOptions } = typegoose;

export interface FavoriteEntity extends defaultClasses.Base { }

@modelOptions({
  schemaOptions: {
    collection: 'favorites'
  }
})
export class FavoriteEntity extends defaultClasses.TimeStamps {

  @prop({
    ref: UserEntity,
    required: true
  })
  public user!: Ref<UserEntity>;

  @prop({
    ref: FilmEntity,
    required: true
  })
  public film!: Ref<FilmEntity>;
}

export const FavoriteModel = getModelForClass(FavoriteEntity);
