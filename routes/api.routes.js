const apiRouter = require('express').Router();
const topicsRouter = require('./topics.routes');

apiRouter.use('/topics', topicsRouter);

module.exports = apiRouter;
