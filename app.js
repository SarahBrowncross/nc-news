const express = require('express');
const app = express();
const apiRouter = require('./routes/api.routes.js');
const { send404Error, send500Error } = require('./errors');

app.use(express.json());

app.use('/api', apiRouter);

app.use('/*', send404Error);
app.use(send500Error);

module.exports = app;
