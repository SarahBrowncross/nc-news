
exports.up = function (knex) {
	console.log('create topics table');
	return knex.schema.createTable('topics', (topicsTable) => {
		topicsTable.string('slug').primary();
		topicsTable.string('description');
	})
};

exports.down = function (knex) {
	console.log('drop topics table');
	return knex.schema.dropTable('topics');
};
