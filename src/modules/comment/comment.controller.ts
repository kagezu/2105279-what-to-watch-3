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
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';
import UserResponse from '../user/response/user.response.js';
import { UserServiceInterface } from '../user/user-service.interface.js';

@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.FilmServiceInterface) private readonly filmService: FilmServiceInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController…');

    this.addRoute({
      path: '/:id',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'id')
      ]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new ValidateDtoMiddleware(CreateCommentDto),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'id')
      ]
    });
  }

  public async index(req: Request, res: Response): Promise<void> {
    const comments = await this.commentService.index(req.params.id);
    if (comments) {
      this.ok(res, comments.map((comment) => fillDTO(CommentResponse, comment)));
      return;
    }
    this.noContent(res);
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { body } = req;
    const filmId = req.params.id;
    const author = req.user.id;
    const result = await this.commentService.create(filmId, { ...body, author });
    await this.filmService.updateRating(filmId, body.rating);
    this.send(
      res,
      StatusCodes.CREATED,
      {
        ...fillDTO(CommentResponse, result),
        author: fillDTO(UserResponse, await this.userService.findById(author))
      }
    );
  }
}
