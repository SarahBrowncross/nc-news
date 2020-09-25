const { addNewComment, fetchComments, updateComment, removeCommentById } = require('../models/comments.models')


exports.sendComments = (req, res, next) => {
	const {article_id} = req.params
	const {username} = req.body
	const {body} = req.body
	const newComment = {author: username, article_id: article_id, body: body}
	addNewComment(article_id, newComment)
		.then(([comment]) => {
			res.status(201).send({comment})
		})
		.catch((err) => {
			next(err)
		})
}

exports.getComments = (req, res, next) => {
	const {article_id} = req.params
	const {sort_by} = req.query
	const {order} = req.query
	fetchComments(article_id, sort_by, order)
		.then((comments) => {
			res.status(200).send({comments})
		})
		.catch((err) => {
			next(err)
		})
}

exports.patchComment = (req, res, next) => {
	const {comment_id} = req.params
	const {inc_votes} = req.body
	updateComment(comment_id, inc_votes)
		.then(([comment]) => {
			res.status(200).send({ comment })
		})
		.catch(next)
}

exports.deleteCommentById = (req, res, next) => {
	const {comment_id} = req.params
	removeCommentById(comment_id)
		.then(() => {
			res.send(204)
		})
		.catch(next)
}