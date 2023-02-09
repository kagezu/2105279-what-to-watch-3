import { IsMongoId } from 'class-validator';

export default class CreateFavoriteDto {

  @IsMongoId({ message: 'film field must be a valid id' })
  public film!: string;

  @IsMongoId({ message: 'user field must be a valid id' })
  public user!: string;
}
