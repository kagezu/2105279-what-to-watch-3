import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.types.js';
import { FavoriteServiceInterface } from './favorite-service.interface.js';
import { FavoriteEntity } from './favorite.entity.js';
import CreateFavoriteDto from './dto/create-favorite.dto.js';
import DeleteFavoriteDto from './dto/delete-favorite.dto.js';

@injectable()
export default class FavoriteService implements FavoriteServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.FavoriteModel) private readonly favoriteModel: types.ModelType<FavoriteEntity>
  ) { }

  public async create(dto: CreateFavoriteDto): Promise<void> {
    await this.favoriteModel.create(dto);
    this.logger.info(`Add film to favorite: ${dto.film} for user: ${dto.user} `);
  }

  public async delete(dto: DeleteFavoriteDto): Promise<void> {
    await this.favoriteModel.deleteMany(dto);
    this.logger.info(`Deleted film from favorite: ${dto.film} for user: ${dto.user}`);
  }

  public async index(user: string): Promise<DocumentType<FavoriteEntity>[]> {
    return this.favoriteModel
      .find({ user })
      .populate({
        path: 'film',
        populate: 'user'
      })
      .exec();
  }
}
