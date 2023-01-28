import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import CreateUserDto from './dto/create-user.dto.js';
import { UserServiceInterface } from './user-service.interface.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.types.js';
// import { FilmEntity } from '../film/film.entity.js';

@injectable()
export default class UserService implements UserServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) { }

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);
    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);
    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email });
  }

  public async findById(id: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ id });
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }
  /*
    public async findFavoriteByEmail(email: string): Promise<DocumentType<FilmEntity>[]> {
      const [result] = await this.userModel
        .find({ email })
        .populate('favorite')
        .populate('user')
        .exec();
      this.logger.info(result as unknown as string);
      return result.favorites as DocumentType<FilmEntity>[];
    }
      public async updateFavoriteByEmail(email: string, filmId: string, status: boolean): Promise<DocumentType<FilmEntity>[]> {
        const favorites = await this.userModel
          .find({ email })
          .exec();
      }
    */
}
