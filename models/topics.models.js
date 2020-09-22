const connection = require('../db/connection');

exports.getTopics = () => {
  return connection('topics').select('*');
};
