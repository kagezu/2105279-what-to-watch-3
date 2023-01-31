import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controller/controller.js';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { CommentServiceInterface } from './comment-service.interface.js';
import { StatusCodes } from 'http-status-codes';
import CreateCommentDto from './dto/create-comment.dto.js';
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

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.find });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
  }

  public async find(_req: Request, res: Response): Promise<void> {

    const comments = await this.commentService.findByFilmId('63d8c73560a8064cd4514e23'); // temp
    if (comments) {
      this.send(res, StatusCodes.OK, comments);
      return;
    }

    this.noContent(res);
  }

  public async create(
    req: Request<Record<string, unknown>, Record<string, unknown>, CreateCommentDto>,
    res: Response): Promise<void> {

    const existFilm = await this.filmService.findById('63d8c73560a8064cd4514e23'); // temp

    if (!existFilm) {
      throw new HttpError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `Film with id «${'63d8c73560a8064cd4514e23'}» not exists.`, // temp
        'CommentController'
      );
    }

    const result = await this.commentService.create('63d8c73560a8064cd4514e23', req.body);
    this.send(
      res,
      StatusCodes.CREATED,
      fillDTO(CommentResponse, result)
    );
  }
}
