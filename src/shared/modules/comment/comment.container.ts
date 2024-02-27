import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { Component } from '../../types/index.js';
import { IController } from '../../libs/rest/index.js';
import { ICommentService } from './comment-service.interface.js';
import { DefaultCommentService } from './default-comment.service.js';
import { CommentEntity, CommentModel } from './comment.entity.js';
import { CommentController } from './comment.controller.js';

export function createCommentContainer() {
  const commentContainer = new Container();

  commentContainer
    .bind<ICommentService>(Component.CommentService)
    .to(DefaultCommentService)
    .inSingletonScope();
  commentContainer
    .bind<types.ModelType<CommentEntity>>(Component.CommentModel)
    .toConstantValue(CommentModel);
  commentContainer
    .bind<IController>(Component.CommentController)
    .to(CommentController)
    .inSingletonScope();

  return commentContainer;
}
