import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import { CommentServiceInterface } from './comment-service.interface.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.types.js';
import { SortType } from '../../types/sort-type.enum.js';
import { DEFAULT_COMMENT_COUNT } from './comment.constant.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.CommentModel) private readonly CommentModel: types.ModelType<CommentEntity>
  ) { }

  public async create(filmId: string, dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const result = await this.CommentModel.create({
      ...dto,
      film: filmId
    });
    this.logger.info(`New Comment created: ${dto.text}`);

    return result;
  }

  public async delete(filmId: string): Promise<number> {
    const result = await this.CommentModel
      .deleteMany({ film: filmId })
      .exec();

    return result.deletedCount;
  }

  public async index(filmId: string, count?: number): Promise<DocumentType<CommentEntity>[] | null> {
    const limit = count ?? DEFAULT_COMMENT_COUNT;
    return await this.CommentModel
      .find({ film: filmId }, {}, { limit })
      .sort({ createdAt: SortType.Down })
      .populate('author')
      .exec();
  }
}
