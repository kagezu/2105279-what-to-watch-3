import { Controller } from '../../common/controller/controller.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { Request, Response } from 'express';
import { fillDTO } from '../../utils/common.js';
import { FavoriteServiceInterface } from './favorite-service.interface.js';
import { FilmServiceInterface } from '../film/film-service.interface.js';
import FilmResponse from '../film/response/film.response.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';

const DEFAULT_USER_ID = '63e4c6f21a7187b4ec0bd2fe';

@injectable()
export default class FavoriteController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.FavoriteServiceInterface) private readonly favoriteService: FavoriteServiceInterface,
    @inject(Component.FilmServiceInterface) private readonly filmService: FilmServiceInterface
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/:id/1',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'id')
      ]
    });
    this.addRoute({
      path: '/:id/0',
      method: HttpMethod.Post,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'id')
      ]
    });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
  }

  public async create(req: Request, res: Response,): Promise<void> {
    await this.favoriteService.create(req.body);
    const result = await this.filmService.show(req.params.id);
    this.ok(res, fillDTO(FilmResponse, result));
  }

  public async delete(req: Request, res: Response): Promise<void> {
    await this.favoriteService.delete(req.body);
    const result = await this.filmService.show(req.params.id);
    this.ok(res, fillDTO(FilmResponse, result));
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const result = await this.favoriteService.index(DEFAULT_USER_ID);
    this.ok(res, result.map((value) => fillDTO(FilmResponse, value.film)));
  }
}
