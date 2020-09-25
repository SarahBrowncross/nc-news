const { removeArticleById, getArticle, updateArticle, getArticles } = require('../models/articles.models')

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

exports.sendArticles = (req, res, next) => {
	const {sort_by} = req.query
	const {order} = req.query
	const {author} = req.query
	const {topic} = req.query
	getArticles(sort_by, order, author, topic)
		.then((articles) => {
			res.status(200).send({ articles })
		})
		.catch(next)
}