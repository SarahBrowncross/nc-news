const {getUser} = require('../models/users.models')

exports.sendUser = (req, res, next) => {
	const user = req.params.username
	getUser(user)
		.then((user) => {
			res.send({ user });
		})
		.catch(next);
}