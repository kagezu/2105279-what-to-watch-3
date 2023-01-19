import { User } from '../../types/user.type.js';
import typegoose, { getModelForClass, defaultClasses } from '@typegoose/typegoose';
import { createSHA256 } from '../../utils/common.js';

const { prop, modelOptions } = typegoose;
enum UserOption {
  MinLengthName = 1,
  MaxLengthName = 150
}

export interface UserEntity extends defaultClasses.Base { }

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  constructor(data: User) {
    super();

    this.email = data.email;
    this.avatarPath = data.avatarPath;
    this.name = data.name;
  }

  @prop({
    unique: true,
    required: true,
    // match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect']
  })
  public email!: string;

  @prop({
    default: '',
    // match: [/\.(?:jpg||png)$|^$/, 'png or jpg format only']
  })
  public avatarPath!: string;

  @prop({
    unique: true,
    required: true,
    minlength: [UserOption.MinLengthName, `Min length for name is ${UserOption.MinLengthName}`],
    maxlength: [UserOption.MaxLengthName, `Max length for name is ${UserOption.MaxLengthName}`]
  })
  public name!: string;

  @prop({ required: true })
  private password!: string;

  public setPassword(password: string, salt: string) {
    if (password.length < 6 || password.length > 12) {
      throw new Error('Password must 6-12 symbols length');
    }

    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
