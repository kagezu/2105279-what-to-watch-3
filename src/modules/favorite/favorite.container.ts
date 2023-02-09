import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { ControllerInterface } from '../../common/controller/controller.interface.js';
import { Component } from '../../types/component.types.js';
import { FavoriteServiceInterface } from './favorite-service.interface.js';
import { FavoriteEntity, FavoriteModel } from './favorite.entity.js';
import FavoriteService from './favorite.service.js';
import FavoriteController from './favorite.controller.js';

const favoriteContainer = new Container();

favoriteContainer.bind<FavoriteServiceInterface>(Component.FavoriteServiceInterface).to(FavoriteService).inSingletonScope();
favoriteContainer.bind<types.ModelType<FavoriteEntity>>(Component.FavoriteModel).toConstantValue(FavoriteModel);
favoriteContainer.bind<ControllerInterface>(Component.FavoriteController).to(FavoriteController).inSingletonScope();

export { favoriteContainer };
