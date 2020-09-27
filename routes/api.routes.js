const apiRouter = require('express').Router();
const topicsRouter = require('./topics.routes');
const usersRouter = require('./users.routes');
const articlesRouter = require('./articles.routes');
const commentsRouter = require('./comments.routes');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter)
apiRouter.use('/comments', commentsRouter)

apiRouter.get('/', (req, res) => {
	res.json({
		'/api/topics': ['GET'],
		'/api/users/username': ['GET'],
		'/api/articles': ['GET'],
		'/api/articles/:article_id': ['GET', 'PATCH', 'DELETE'],
		'/api/articles/:article_id/comments': ['POST', 'GET'],
		'/api/comments/:comment_id': ['PATCH', 'DELETE']
	})
})

module.exports = apiRouter;
