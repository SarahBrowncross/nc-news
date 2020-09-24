const usersRouter = require('express').Router();
const { sendUser } = require('../controllers/users.controllers');
const { handle405Error } = require('../errors');

usersRouter.route('/:username').get(sendUser).all(handle405Error);



module.exports = usersRouter;
