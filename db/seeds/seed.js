const data = require('../data/index');
const { topicsData, articlesData, commentsData, usersData } = data;
const { formatTime } = require('../utils/data-manipulation');

exports.seed = function (knex) {
  return knex.migrate
    .rollback()
    .then(() => {
      return knex.migrate.latest();
    })
    .then(() => {
      return Promise.all([
        knex('topics').insert(topicsData).returning('*'),
        knex('users').insert(usersData).returning('*'),
      ]);
    })
    .then(([topics, users]) => {
      const formattedArticles = formatTime(articlesData);
      return knex('articles').insert(formattedArticles).returning('*');
    })
    .then((articles) => {
      console.log(articles);
    });
};
