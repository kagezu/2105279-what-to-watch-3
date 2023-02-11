import { IsString, Length, Max, Min } from 'class-validator';
import { CommentOption } from '../comment.constant.js';

export default class CreateCommentDto {
  @IsString({ message: 'text is required' })
  @Length(
    CommentOption.MinLengthText,
    CommentOption.MaxLengthText,
    { message: `Min length is ${CommentOption.MinLengthText}, max is ${CommentOption.MaxLengthText}` }
  )
  public text!: string;

  @Min(CommentOption.MinRates, { message: `Min rates is ${CommentOption.MinRates}` })
  @Max(CommentOption.MaxRates, { message: `Max rates is ${CommentOption.MaxRates}` })
  public rating!: number;

  public author!: string;
}
