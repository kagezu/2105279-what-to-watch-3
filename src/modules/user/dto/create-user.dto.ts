import { IsEmail, IsString, Length } from 'class-validator';
import { UserOption } from '../user.constant.js';

export default class CreateUserDto {
  @IsEmail({}, { message: 'email must be valid address' })
  public email!: string;

  @IsString({ message: 'avatarPath is required' })
  public avatarPath!: string;

  @IsString({ message: 'firstname is required' })
  @Length(
    UserOption.MinLengthName,
    UserOption.MaxLengthName,
    { message: `Min length is ${UserOption.MinLengthName}, max is ${UserOption.MaxLengthName}` }
  )
  public name!: string;

  @IsString({ message: 'password is required' })
  @Length(
    UserOption.MinLengthPassword,
    UserOption.MaxLengthPassword,
    { message: `Min length for password is ${UserOption.MinLengthPassword}, max is ${UserOption.MaxLengthPassword}` }
  )
  public password!: string;
}
