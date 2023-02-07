import { DocumentType } from '@typegoose/typegoose';
import CreateCommentDto from './dto/create-comment.dto.js';
import { CommentEntity } from './comment.entity.js';

export interface CommentServiceInterface {
  /** Добавить новый комментарий к определённому фильму*/
  create(filmId: string, dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;

  /** Удаление комментариев к определённому фильму*/
  delete(filmId: string): Promise<number>;

  /** Получить список комментариев для определённого фильма*/
  index(filmId: string, count?: number): Promise<DocumentType<CommentEntity>[] | null>;
}
