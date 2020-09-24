const { removeArticleById, getArticle, updateArticle, addNewComment } = require('../models/articles.models')

exports.deleteArticleById = (req, res, next) => {
	const {article_id} = req.params
	removeArticleById(article_id)
		.then(() => {
			res.send(204)
		})
		.catch(next)
}

exports.sendArticle = (req, res, next) => {
	const {article_id} = req.params
	getArticle(article_id)
		.then(([article]) => {
			res.send({ article });
		})
		.catch(next);
}

exports.patchArticle = (req, res, next) => {
	const {article_id} = req.params
	const {inc_votes} = req.body
	updateArticle(article_id, inc_votes)
		.then(([article]) => {
			res.status(200).send({ article })
		})
		.catch(next)
}

exports.sendComments = (req, res, next) => {
	const {article_id} = req.params
	const {username} = req.body
	const {body} = req.body
	addNewComment(article_id, username, body)
		.then(([comments]) => {
			res.status(201).send({comments})
		})
		.catch(next)
}