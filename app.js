const express = require('express');
const app = express();
const apiRouter = require('./routes/api.routes.js');
const { send404Error, send404UserError, handle400Error, send500Error } = require('./errors');

app.use(express.json());

app.use('/api', apiRouter);

app.use('/*', send404Error);
app.use(send404UserError);
app.use(handle400Error);
app.use(send500Error);

const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));

module.exports = app;
