import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controller/controller.js';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { CommentServiceInterface } from './comment-service.interface.js';
import { StatusCodes } from 'http-status-codes';
import CommentResponse from './response/comment.response.js';
import { fillDTO } from '../../utils/common.js';
import { FilmServiceInterface } from '../film/film-service.interface.js';
import HttpError from '../../common/errors/http-error.js';

@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.FilmServiceInterface) private readonly filmService: FilmServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController…');

    this.addRoute({ path: '/:id', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/:id', method: HttpMethod.Post, handler: this.create });
  }

  public async index(req: Request, res: Response): Promise<void> {

    const comments = await this.commentService.index(req.params.id);
    if (comments) {
      this.ok(res, comments);
      return;
    }

    this.noContent(res);
  }

  public async create(req: Request, res: Response): Promise<void> {

    const existFilm = await this.filmService.show(req.params.id);

    if (!existFilm) {
      throw new HttpError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `Film with id «${req.params.id}» not exists.`,
        'CommentController'
      );
    }

    const result = await this.commentService.create(req.params.id, req.body);
    this.send(
      res,
      StatusCodes.CREATED,
      fillDTO(CommentResponse, result)
    );
  }
}
