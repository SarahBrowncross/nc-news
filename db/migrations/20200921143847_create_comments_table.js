const comments = require("../data/development-data/comments");

exports.up = function (knex) {
	console.log('create comments table');
	return knex.schema.createTable('comments', (commentsTable) => {
		commentsTable.increments('comment_id');
		commentsTable
			.string('author')
			.references('users.username')
			.notNullable();
		commentsTable
			.integer('article_id')
			.references('articles.article_id')
			.notNullable();
		commentsTable.integer('votes').defaultTo(0);
		commentsTable.timestamp('created_at').defaultTo(knex.fn.now())
		commentsTable.text('body');
	})
};

exports.down = function (knex) {
	console.log('drop comments table');
	return knex.schema.dropTable('comments');
};
