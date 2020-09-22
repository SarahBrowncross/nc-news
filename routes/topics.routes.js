const topicsRouter = require('express').Router();
const { sendTopics } = require('../controllers/topics.controllers');
const { handle405Error } = require('../errors');

topicsRouter.route('/').get(sendTopics).all(handle405Error);

module.exports = topicsRouter;
