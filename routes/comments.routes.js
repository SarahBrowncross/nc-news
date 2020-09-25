const commentsRouter = require('express').Router();
const { patchComment, deleteCommentById } = require('../controllers/comments.controllers')
const {handle405Error} = require('../errors/index')

commentsRouter.route('/:comment_id').patch(patchComment).delete(deleteCommentById).all(handle405Error);

module.exports = commentsRouter;
