import { Comment } from '../../types/comment.type.js';
import typegoose, { getModelForClass, defaultClasses } from '@typegoose/typegoose';
import { User } from '../../types/user.type.js';

const { prop, modelOptions } = typegoose;
enum CommentOption {
  MinLengthText = 5,
  MaxLengthText = 1024
}

export interface CommentEntity extends defaultClasses.Base { }

@modelOptions({
  schemaOptions: {
    collection: 'comments'
  }
})
export class CommentEntity extends defaultClasses.TimeStamps {
  constructor(data: Comment) {
    super();

    this.text = data.text;
    this.rating = data.rating;
    // this.released = data.released;
    // this.author = data.author;
    // this.filmId = data.filmId;
  }

  @prop({
    required: true,
    minlength: [CommentOption.MinLengthText, `Min length for text is ${CommentOption.MinLengthText}`],
    maxlength: [CommentOption.MaxLengthText, `Max length for text is ${CommentOption.MaxLengthText}`]
  })
  public text!: string;

  @prop({})
  public rating!: number;

  @prop({})
  public released!: string;

  @prop({})
  public author!: User;

  @prop({})
  public userId!: string;

  @prop({})
  public filmId!: string;
}

export const commentModel = getModelForClass(CommentEntity);
