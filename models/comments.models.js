const connection = require('../db/connection')

exports.addNewComment = (article_id, newComment) => {
	return connection('comments')
		.insert(newComment)
		.returning('*')
		.where('article_id', article_id)
}

exports.fetchComments = (article_id, sort_by = "created_at", order = 'desc') => {
	return connection('comments')
		.select('*')
		.where('article_id', article_id)
		.orderBy(sort_by || 'created_at', order || 'desc')
		.then((comments) => {
			if (comments.length === 0) {
				return connection('articles')
					.select('*')
					.where('article_id', article_id)
					.then((articles) => {
						if (articles.length === 0){
							return Promise.reject({status:404, msg:'This article does not exist'})
						}
						else{
							return [];
						}
					})
			} return comments
		})
}

exports.updateComment = (comment_id, votes = 'invalid') => {
	return connection('comments')
		.select('*')
		.where('comment_id', comment_id)
		.increment('votes', votes)
		.then((rowsUpdated) => {
			if(rowsUpdated === 1){
				return connection('comments')
				.select('*')
				.where('comment_id', comment_id)
			}
			else{
				return Promise.reject({
					status: 404, msg: 'This comment does not exist'
				});
			}
		})
}

exports.removeCommentById = (comment_id) => {
	return connection('comments')
		.where('comment_id', comment_id)
		.del()
		.then((delCount) => {
			if (delCount === 0) {
				return Promise.reject({
					status: 404, msg: 'comment not found'
				});
			};
			return delCount;
		})
}