import { Controller } from '../../common/controller/controller.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { Request, Response } from 'express';
import CreateFilmDto from './dto/create-film.dto.js';
import { FilmServiceInterface } from './film-service.interface.js';
import HttpError from '../../common/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../utils/common.js';
import FilmResponse from './response/film.response.js';
// import { ConfigInterface } from '../../common/config/config.interface.js';
// import UpdateFilmDto from './dto/update-film.dto.js';
import { UserServiceInterface } from '../user/user-service.interface.js';
import UserResponse from '../user/response/user.response.js';
import { FilmEntity } from './film.entity.js';
import { DocumentType } from '@typegoose/typegoose';
import { BeAnObject } from '@typegoose/typegoose/lib/types.js';

@injectable()
export default class FilmController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(Component.FilmServiceInterface) private readonly filmService: FilmServiceInterface
    // @inject(Component.ConfigInterface) private readonly configService: ConfigInterface,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.find });
    this.addRoute({ path: '/promo', method: HttpMethod.Get, handler: this.promo });
    this.addRoute({ path: '/id/{:id}', method: HttpMethod.Get, handler: this.findById });
    // this.addRoute({ path: '/', method: HttpMethod.Post, handler: () => null });
    // this.addRoute({ path: '/', method: HttpMethod.Post, handler: () => null });
    // this.addRoute({ path: '/', method: HttpMethod.Post, handler: () => null });
    // this.addRoute({ path: '/', method: HttpMethod.Post, handler: () => null });
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateFilmDto>,
    res: Response,
  ): Promise<void> {
    const result = await this.filmService.create(body);

    if (result.user) {
      const user = await this.userService.findById(result.user.toString());
      this.send(
        res,
        StatusCodes.CREATED,
        fillDTO(FilmResponse, {
          ...result,
          user: fillDTO(UserResponse, user)
        })
      );
    }
  }

  public async find(_req: Request, res: Response): Promise<void> {
    const result = await this.filmService.find();
    const response = result.map(this.filmFillDTO);
    this.send(
      res,
      StatusCodes.OK,
      response
    );
  }

  public async promo(_req: Request, res: Response): Promise<void> {
    const result = await this.filmService.findPromo();

    if (!result) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Promo film not exists.',
        'UserController'
      );
    }

    const response = this.filmFillDTO(result);
    this.send(
      res,
      StatusCodes.OK,
      response
    );
  }

  public async findById(_req: Request, res: Response): Promise<void> {
    const response = await this.filmService.findById('63d8c73560a8064cd4514e23');
    this.send(
      res,
      StatusCodes.OK,
      response
    );
  }

  private filmFillDTO(film: DocumentType<FilmEntity, BeAnObject>) {
    const response = fillDTO(FilmResponse, film);
    return ({
      ...response,
      user: fillDTO(UserResponse, response.user)
    });
  }
}
