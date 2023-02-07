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
// import { ConfigInterface } from '../../common/config/config.interface.js';

const DEFAULT_USER_ID = '63dbb223cba5369b4ce303ae';

@injectable()
export default class FavoriteController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.FavoriteServiceInterface) private readonly favoriteService: FavoriteServiceInterface,
    @inject(Component.FilmServiceInterface) private readonly filmService: FilmServiceInterface
    // @inject(Component.ConfigInterface) private readonly configService: ConfigInterface,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({ path: '/:id/1', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/:id/0', method: HttpMethod.Post, handler: this.delete });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.delete });
  }

  public async create(req: Request, res: Response,): Promise<void> {
    await this.favoriteService.create({
      user: DEFAULT_USER_ID,
      film: req.params.id
    });

    const result = await this.filmService.show(req.params.id);
    this.ok(res, fillDTO(FilmResponse, result));
  }

  public async delete(req: Request, res: Response): Promise<void> {
    await this.favoriteService.delete({
      user: DEFAULT_USER_ID,
      film: req.params.id
    });

    const result = await this.filmService.show(req.params.id);
    this.ok(res, fillDTO(FilmResponse, result));
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const result = await this.favoriteService.index(DEFAULT_USER_ID);

    this.ok(res, result.map((value) => fillDTO(FilmResponse, value.film)));
  }
}

