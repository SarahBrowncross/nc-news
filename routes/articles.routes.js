const articlesRouter = require('express').Router();
const { deleteArticleById, sendArticle, patchArticle, sendComments } = require('../controllers/articles.controllers.js');
const {handle405Error} = require('../errors/index')


articlesRouter.route('/:article_id').delete(deleteArticleById).get(sendArticle).patch(patchArticle).all(handle405Error);

articlesRouter.route('/:article_id/comments').get(sendComments)

module.exports = articlesRouter;
