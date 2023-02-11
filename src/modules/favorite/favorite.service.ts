import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.types.js';
import { FavoriteServiceInterface } from './favorite-service.interface.js';
import { FavoriteEntity } from './favorite.entity.js';
import SwitchFavoriteDto from './dto/switch-favorite.dto.js';

@injectable()
export default class FavoriteService implements FavoriteServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.FavoriteModel) private readonly favoriteModel: types.ModelType<FavoriteEntity>
  ) { }

  public async create(dto: SwitchFavoriteDto): Promise<void> {
    const result = await this.favoriteModel.find(dto);
    if (!result.length) {
      await this.favoriteModel.create(dto);
      this.logger.info(`Add film to favorite: ${dto.film} for user: ${dto.user} `);
    }
  }

  public async delete(dto: SwitchFavoriteDto): Promise<void> {
    await this.favoriteModel.deleteMany(dto);
    this.logger.info(`Deleted film from favorite: ${dto.film} for user: ${dto.user}`);
  }

  public async deleteAll(filmId: string): Promise<void> {
    await this.favoriteModel.deleteMany({ film: filmId });
    this.logger.info(`Deleted film from favorite: ${filmId} for all user`);
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

  public async exists(dto: SwitchFavoriteDto): Promise<boolean> {
    return (await this.favoriteModel
      .exists(dto)) !== null;
  }
}
