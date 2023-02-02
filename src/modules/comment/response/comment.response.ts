import { Expose } from 'class-transformer';

export default class CommentResponse {
  @Expose()
  public text!: string;

  @Expose()
  public rating!: number;

  @Expose()
  public released!: string;

  @Expose()
  public author!: string;
}
