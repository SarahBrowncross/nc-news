
exports.up = function(knex) {
	console.log('create users table');
  return knex.schema.createTable('users', (usersTable) => {
	  usersTable.string('username').primary();
	  usersTable.string('avatar_url');
	  usersTable.string('name').notNullable();
  })
};

exports.down = function(knex) {
	console.log('drop users table');
	return knex.schema.dropTable('users');
};
