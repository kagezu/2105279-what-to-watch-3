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
    @inject(Component.FilmServiceInterface) private readonly filmService: FilmServiceInterface,
  ) {
    super(logger);
    this.logger.info('Register routes for FilmController…');

    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/promo', method: HttpMethod.Get, handler: this.promo });
    this.addRoute({ path: '/:id', method: HttpMethod.Get, handler: this.show });
    this.addRoute({ path: '/:id', method: HttpMethod.Patch, handler: this.update });
    this.addRoute({ path: '/:id', method: HttpMethod.Delete, handler: this.delete });
    this.addRoute({ path: '/genre/:genre', method: HttpMethod.Get, handler: this.findByGenre });
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
        {
          ...fillDTO(FilmResponse, result),
          user: fillDTO(UserResponse, user)
        }
      );
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    const result = await this.filmService.update(req.params.id, req.body);

    if (!result) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Film not exists.',
        'UserController'
      );
    }

    this.send(
      res,
      StatusCodes.CREATED,
      this.filmFillDTO(result)
    );
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const result = await this.filmService.delete(req.params.id);

    if (!result) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Film not exists.',
        'UserController'
      );
    }

    this.send(
      res,
      StatusCodes.OK,
      this.filmFillDTO(result)
    );
  }


  public async index(_req: Request, res: Response): Promise<void> {
    const result = await this.filmService.index();
    const response = result.map(this.filmFillDTO);
    this.send(
      res,
      StatusCodes.OK,
      response
    );
  }

  public async promo(_req: Request, res: Response): Promise<void> {
    const result = await this.filmService.promo();

    if (!result) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Promo film not exists.',
        'UserController'
      );
    }

    this.send(
      res,
      StatusCodes.OK,
      this.filmFillDTO(result)
    );
  }

  public async show(req: Request, res: Response): Promise<void> {
    const result = await this.filmService.show(req.params.id);

    if (!result) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Film not exists.',
        'UserController'
      );
    }

    this.send(
      res,
      StatusCodes.OK,
      this.filmFillDTO(result)
    );
  }

  public async findByGenre(req: Request, res: Response): Promise<void> {
    const result = await this.filmService.findByGenre(req.params.genre);

    if (!result) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Film with genre ${req.params.genre} not exists.`,
        'UserController'
      );
    }

    this.send(
      res,
      StatusCodes.OK,
      result.map(this.filmFillDTO)
    );
  }

  private filmFillDTO(film: DocumentType<FilmEntity, BeAnObject>) {
    const response = fillDTO(FilmResponse, film);
    return ({
      ...response,
      user: fillDTO(UserResponse, film.user)
    });
  }
}
