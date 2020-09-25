const articlesRouter = require('express').Router();
const { deleteArticleById, sendArticle, patchArticle, sendArticles } = require('../controllers/articles.controllers.js');
const { sendComments, getComments } = require('../controllers/comments.controllers.js')
const {handle405Error} = require('../errors/index')


articlesRouter.route('/:article_id').delete(deleteArticleById).get(sendArticle).patch(patchArticle).all(handle405Error);

articlesRouter.route('/:article_id/comments').post(sendComments).get(getComments).all(handle405Error);

articlesRouter.route('/').get(sendArticles)

module.exports = articlesRouter;
