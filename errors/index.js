exports.send404Error = (req, res, next) => {
  res.status(404).send({ msg: 'This page does not exist' });
};

exports.send404UserError = ({status, msg, ...err}, req, res, next) => {
  if(status === 404){
  res.status(status).send({msg})
  }
  else{next({status, msg, ...err})}
}

exports.handle400Error = (err, req, res, next) => {
  if (err.code === '22P02'){
    res.status(400).send({msg: 'Bad request'})
  }
  else{next(err)}
}

exports.send500Error = (err, req, res, next) => {
  console.log(err, 'error 500');
  res.status(500).send({ msg: 'Internal server error' });
};

exports.handle405Error = (req, res, next) => {
  res.status(405).send({ msg: 'Method not allowed' });
};
