import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { FilmEntity, FilmModel } from './film.entity.js';
import { FilmServiceInterface } from './film-service.interface.js';
import FilmService from './film.service.js';
import { Component } from '../../types/component.types.js';
import { ControllerInterface } from '../../common/controller/controller.interface.js';
import FilmController from './film.controller.js';

const filmContainer = new Container();

filmContainer.bind<FilmServiceInterface>(Component.FilmServiceInterface).to(FilmService).inSingletonScope();
filmContainer.bind<types.ModelType<FilmEntity>>(Component.FilmModel).toConstantValue(FilmModel);
filmContainer.bind<ControllerInterface>(Component.FilmController).to(FilmController).inSingletonScope();

export { filmContainer };
