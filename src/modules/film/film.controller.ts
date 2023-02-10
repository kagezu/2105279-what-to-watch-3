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
import { CommentServiceInterface } from '../comment/comment-service.interface.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import UpdateFilmDto from './dto/update-film.dto.js';
import { Genre } from '../../types/genre.type.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';
import UserResponse from '../user/response/user.response.js';

@injectable()
export default class FilmController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(Component.FilmServiceInterface) private readonly filmService: FilmServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
  ) {
    super(logger);
    this.logger.info('Register routes for FilmController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateFilmDto)]
    });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/promo', method: HttpMethod.Get, handler: this.promo });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'id')
      ]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new ValidateDtoMiddleware(UpdateFilmDto),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'id')
      ]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'id')
      ]
    });
    this.addRoute({
      path: '/genre/:genre',
      method: HttpMethod.Get,
      handler: this.findByGenre
    });
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateFilmDto>,
    res: Response,
  ): Promise<void> {
    const result = await this.filmService.create(body);
    this.send(
      res,
      StatusCodes.CREATED,
      {
        ...fillDTO(FilmResponse, result),
        user: fillDTO(
          UserResponse,
          await this.userService.findById(body.user)
        )
      }
    );
  }

  public async update(req: Request, res: Response): Promise<void> {
    const result = await this.filmService.update(req.params.id, req.body);
    this.send(
      res,
      StatusCodes.CREATED,
      fillDTO(FilmResponse, result)
    );
  }

  public async delete(req: Request, res: Response): Promise<void> {
    await this.commentService.delete(req.params.id);
    const result = await this.filmService.delete(req.params.id);
    this.send(
      res,
      StatusCodes.OK,
      fillDTO(FilmResponse, result)
    );
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const result = await this.filmService.index();
    const response = result.map((value) => fillDTO(FilmResponse, value));
    this.send(
      res,
      StatusCodes.OK,
      response
    );
  }

  public async show(req: Request, res: Response): Promise<void> {
    const result = await this.filmService.show(req.params.id);
    this.send(
      res,
      StatusCodes.OK,
      fillDTO(FilmResponse, result)
    );
  }

  public async promo(_req: Request, res: Response): Promise<void> {
    const result = await this.filmService.promo();
    this.send(
      res,
      StatusCodes.OK,
      fillDTO(FilmResponse, result)
    );
  }

  public async findByGenre(req: Request, res: Response): Promise<void> {
    const { genre } = req.params;

    if (!Object.values(Genre).some((value) => value === genre)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `Genre with ${genre} not implements, use only: ${Object.values(Genre).join(', ')}`,
        'UserController'
      );
    }

    const result = await this.filmService.findByGenre(genre);

    if (!result) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Film with genre ${genre} not exists.`,
        'UserController'
      );
    }

    this.send(
      res,
      StatusCodes.OK,
      fillDTO(FilmResponse, result)
    );
  }
}
