const connection = require('../db/connection')

exports.removeArticleById = (article_id) => {
	return connection('articles')
		.where('article_id', article_id)
		.del()
		.then((delCount) => {
			if (delCount === 0) {
				return Promise.reject({
					status: 404, msg: 'Article not found'
				});
			};
			return delCount;
		})
}

exports.getArticle = (article_id) => {
	return connection('articles')
		.select('articles.*')
		.where('articles.article_id', article_id)
		.count('comment_id AS comment_count')
		.leftJoin('comments', 'comments.article_id', 'articles.article_id')
		.groupBy('articles.article_id')
		.then((articleCount) => {
			if (articleCount.length === 0) return Promise.reject({status:404, msg:'This article does not exist'})
			return articleCount
		})
}

exports.updateArticle = (article_id, votes) => {
	return connection('articles')
		.select('*')
		.where('article_id', article_id)
		.increment('votes', votes)
		.then((rowsUpdated) => {
			if(rowsUpdated === 1){
				return connection('articles')
				.select('*')
				.where('article_id', article_id)
			}
			else{
				return Promise.reject({
					status: 404, msg: 'This article does not exist'
				});
			}
		})
}

exports.addNewComment = (article_id, username, body) => {
	return connection('articles')
		

}