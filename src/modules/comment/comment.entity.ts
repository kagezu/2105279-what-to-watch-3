import typegoose, { getModelForClass, defaultClasses, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity.js';
import { FilmEntity } from '../film/film.entity.js';
import { CommentOption } from './comment.constant.js';

const { prop, modelOptions } = typegoose;

export interface CommentEntity extends defaultClasses.Base { }

@modelOptions({
  schemaOptions: {
    collection: 'comments'
  }
})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({
    required: true,
    minlength: [CommentOption.MinLengthText, `Min length for text is ${CommentOption.MinLengthText}`],
    maxlength: [CommentOption.MaxLengthText, `Max length for text is ${CommentOption.MaxLengthText}`]
  })
  public text!: string;

  @prop({})
  public rating!: number;

  @prop({
    ref: UserEntity,
    required: true
  })
  public author!: Ref<UserEntity>;

  @prop({
    ref: FilmEntity,
    required: true
  })
  public film!: Ref<FilmEntity>;
}

export const commentModel = getModelForClass(CommentEntity);
