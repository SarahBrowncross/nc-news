const connection = require('../db/connection');

exports.getUser = (user) => {
	return connection('users')
		.select('*')
		.where('username', user)
		.then((userCount) => {
			if (userCount.length === 0) return Promise.reject({status:404, msg:'This user does not exist'})
			return userCount
		})
}