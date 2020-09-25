const app = require('../app.js');
const request = require('supertest');
const connection = require('../db/connection');

beforeEach(() => {
	return connection.seed.run();
});

afterAll(() => {
	return connection.destroy();
});

describe('app', () => {
	it('returns status 404 when given an invalid path', () => {
		return request(app)
			.get('/sheep')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('This page does not exist');
			});
	});
	describe('/api', () => {
		describe('/topics', () => {
			describe('GET', () => {
				it('returns status 200 and an object containing an array of topics', () => {
					return request(app)
						.get('/api/topics')
						.expect(200)
						.then(({ body }) => {
							expect(body.topics).toHaveLength(3);
							expect(Object.keys(body.topics[0])).toEqual(
								expect.arrayContaining(['description', 'slug'])
							);
						});
				});
				it('returns status 405 when given an invalid method', () => {
					const invalidMethods = ['delete', 'patch', 'put'];
					const methodPromises = invalidMethods.map((method) => {
						return request(app)
						[method]('/api/topics')
							.expect(405)
							.then(({ body }) => {
								expect(body.msg).toBe('Method not allowed');
							});
					});
					return Promise.all(methodPromises);
				});
			});
		});
		describe('/users', () => {
			describe(':username', () => {
				describe('GET', () => {
					it('returns status 200 and an object containing a user', () => {
						return request(app)
							.get('/api/users/icellusedkars')
							.expect(200)
							.then(({ body }) => {
								expect(Object.keys(body.user[0])).toEqual(
									expect.arrayContaining(['username', 'avatar_url', 'name'])
								);
							});
							
					});
					it('returns status 404 for a valid but non-existant user', () => {
						return request(app)
							.get('/api/users/isellusedcars')
							.expect(404)
							.then(({ body }) => {
								expect(body.msg).toBe('This user does not exist');
							});
					})
				});
			});
		});
		describe('/articles', () => {
			describe('GET', () => {
				it('returns status 200 and an array of article objects with the correct properties', () => {
					return request(app)
							.get('/api/articles')
							.expect(200)
							.then(({ body }) => {
								expect(Object.keys(body.articles[0])).toEqual(
									expect.arrayContaining(['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count'])
								);
							});
				});
				it('by default sorts articles by date descending', () => {
					return request(app)
						.get('/api/articles')
						.expect(200)
						.then(({ body: {articles} }) => {
							expect(articles).toBeSortedBy('created_at', {descending: true})
						});
				});
				it('filters by author', () => {
					return request(app)
						.get('/api/articles/?author=icellusedkars')
						.expect(200)
						.then(({ body: {articles} }) => {
							expect(articles[0].author).toBe('icellusedkars')
							const isSam = (article) => {return article.author === 'icellusedkars'}
							expect(articles.every(isSam)).toBe(true)
						});
				});
				it('filters by topic', () => {
					return request(app)
						.get('/api/articles/?topic=mitch')
						.expect(200)
						.then(({ body: {articles} }) => {
							expect(articles[0].topic).toBe('mitch')
							const isMitch = (article) => {return article.topic === 'mitch'}
							expect(articles.every(isMitch)).toBe(true)
						});
				});
				it('invalid sort by and order returns 400', () => {
					return request(app)
						.get('/api/articles/?sort_by=voooootes&order=low')
						.expect(400)
						.then(({ body }) => {
							expect(body.msg).toBe('Bad request');
						});
				});
				it('invalid filter returns no results', () => {
					return request(app)
						.get('/api/articles/?topic=sam')
						.expect(200)
						.then(({ body: {articles} }) => {
							console.log(articles)
							expect(articles.length).toBe(0);
						});
				});
			});
			describe('/:article_id', () => {
				describe('DELETE', () => {
					it('returns status 204', () => {
						return request(app)
							.delete('/api/articles/11').expect(204)
					})
					it('can delete articles referenced by comments', () => {
						return request(app)
							.delete('/api/articles/1').expect(204)
					})
					it('returns a 404 for a valid but non-existant article id', () => {
						return request(app)
						.delete('/api/articles/1000').expect(404).then(({body}) => {
							expect(body.msg).toBe('Article not found')
						})
					});
					it('returns 400 for a non valid article id', () => {
						return request(app)
						.delete('/api/articles/articleTwo').expect(400).then(({body}) => {
							expect(body.msg).toBe('Bad request')
						})
					});
				});				
				describe('GET', () => {
					it('returns status 200 and an object containing an article', () => {
						return request(app)
							.get('/api/articles/1')
							.expect(200)
							.then(({ body }) => {
								expect(Object.keys(body.article)).toEqual(
									expect.arrayContaining(['article_id', 'title', 'body', 'votes', 'topic', 'author', 'created_at', 'comment_count'])
								);
								expect(body.article.comment_count).toBe('13')
							});
					});
					it('returns status 404 if article does not exist', () => {
						return request(app)
							.get('/api/articles/400')
							.expect(404)
							.then(({ body }) => {
								expect(body.msg).toBe('This article does not exist');
							});
					});
				});
				describe('PATCH', () => {
					it('returns status 200 and increases the votes by the given value', () => {
						return request(app)
							.patch('/api/articles/2')
							.send({ inc_votes: 3 })
							.expect(200)
							.then(({ body }) => {
								expect(body.article.votes).toBe(3)
							})
					});
					it('returns status 404 if article does not exist', () => {
						return request(app)
							.patch('/api/articles/400')
							.send({ inc_votes: 3 })
							.expect(404)
							.then(({ body }) => {
								expect(body.msg).toBe('This article does not exist');
							});
					});
					it('returns 400 for a non valid article id', () => {
						return request(app)
							.patch('/api/articles/articleTwo')
							.send({ inc_votes: 3 })
							.expect(400)
							.then(({body}) => {
								expect(body.msg).toBe('Bad request')
						})
					});
					it('returns 400 for a non valid number of votes', () => {
						return request(app)
							.patch('/api/articles/2')
							.send({ inc_votes: 'fourteen' })
							.expect(400)
							.then(({body}) => {
								expect(body.msg).toBe('Bad request')
						})
					});
					it('returns 400 for a non valid key', () => {
						return request(app)
							.patch('/api/articles/2')
							.send({ inc_vaaaaates: 4 })
							.expect(400)
							.then(({body}) => {
								expect(body.msg).toBe('Bad request')
						})
					});
				});
				describe('invalid method', () => {
					it('returns status 405 when given an invalid method', () => {
						const invalidMethods = ['put', 'post'];
						const methodPromises = invalidMethods.map((method) => {
							return request(app)
							[method]('/api/articles/3')
								.expect(405)
								.then(({ body }) => {
									expect(body.msg).toBe('Method not allowed');
								});
						});
						return Promise.all(methodPromises);
					});
				});
			describe('/:article_id/comments', () => {
				describe('POST', () => {
					it('returns status 201 and the new comment', () => {
						return request(app)
							.post('/api/articles/11/comments')
							.send({ username: 'icellusedkars', body: 'I wish I was a cat' })
							.expect(201)
							.then(({ body }) => {
								expect(body.comment.body).toBe('I wish I was a cat')
							})
					});
					it('returns 400 for a non valid article id', () => {
						return request(app)
							.post('/api/articles/articleTwo/comments')
							.send({ username: 'icellusedkars', body: 'I wish I was a dog' })
							.expect(400)
							.then(({body}) => {
								expect(body.msg).toBe('Bad request')
						})
					});
					it('returns 400 for a non valid username', () => {
						return request(app)
							.post('/api/articles/2/comments')
							.send({ username: 'idonotexist', body: 'I wish I was a dog' })
							.expect(400)
							.then(({body}) => {
								expect(body.msg).toBe('Bad request')
						})
					});
					it('returns 400 for a missing username', () => {
						return request(app)
							.post('/api/articles/2/comments')
							.send({ body: 'I wish I was a dog' })
							.expect(400)
							.then(({body}) => {
								expect(body.msg).toBe('Bad request')
						})
					});
					it('returns 400 for a missing body', () => {
						return request(app)
							.post('/api/articles/2/comments')
							.send({ username: 'icellusedkars' })
							.expect(400)
							.then(({body}) => {
								expect(body.msg).toBe('Bad request')
						})
					});
					it('returns status 400 if article does not exist', () => {
						return request(app)
							.post('/api/articles/400/comments')
							.send({ username: 'icellusedkars', body: 'I wish I was a turtle' })
							.expect(400)
							.then(({ body }) => {
								expect(body.msg).toBe('Bad request');
							});
					});
				})
				describe('GET', () => {
					it('returns status 200 and an array of comments with the correct properties', () => {
						return request(app)
							.get('/api/articles/1/comments')
							.expect(200)
							.then(({ body }) => {
								expect(Object.keys(body.comments[0])).toEqual(
									expect.arrayContaining(['comment_id', 'votes', 'created_at', 'author', 'body'])
								);
							});
					});
					it('sorts comments, defaulting to created at if no sort given', () => {
						return request(app)
							.get('/api/articles/1/comments')
							.expect(200)
							.then(({ body: {comments} }) => {
								expect(comments).toBeSortedBy('created_at', {descending: true})
							});
					});
					it('sorts comments by another valid column', () => {
						return request(app)
							.get('/api/articles/1/comments?sort_by=votes')
							.expect(200)
							.then(({ body: {comments} }) => {
								expect(comments).toBeSortedBy('votes', {descending: true})
							});
					});
					it('orders by ascending', () => {
						return request(app)
							.get('/api/articles/1/comments?order=asc')
							.expect(200)
							.then(({ body: {comments} }) => {
								expect(comments).toBeSortedBy('created_at')
							});
					});
					it('orders by descending by default', () => {
						return request(app)
							.get('/api/articles/1/comments?sort_by=votes')
							.expect(200)
							.then(({ body: {comments} }) => {
								expect(comments).toBeSortedBy('votes', {descending: true})
							});
					});
					it('invalid sort by and order returns 400', () => {
						return request(app)
							.get('/api/articles/1/comments?sort_by=voooootes&order=low')
							.expect(400)
							.then(({ body }) => {
								expect(body.msg).toBe('Bad request');
							});
					});
					it('returns 400 for invalid article id', () => {
						return request(app)
							.get('/api/articles/articlethree/comments')
							.expect(400)
							.then(({ body }) => {
								expect(body.msg).toBe('Bad request');
							});
					});
					it('returns 404 for no article', () => {
						return request(app)
							.get('/api/articles/4000/comments')
							.expect(404)
							.then(({ body }) => {
								expect(body.msg).toBe('This article does not exist');
							});
					});
					it('returns message if no comments', () => {
						return request(app)
							.get('/api/articles/2/comments')
							.expect(200)
							.then(({ body: {comments} }) => {
								expect(comments).toEqual([]);
							});
					});
				});
				describe('invalid method', () => {
					it('returns status 405 when given an invalid method', () => {
						const invalidMethods = ['patch', 'put', 'delete'];
						const methodPromises = invalidMethods.map((method) => {
							return request(app)
							[method]('/api/articles/3/comments')
								.expect(405)
								.then(({ body }) => {
									expect(body.msg).toBe('Method not allowed');
								});
						});
						return Promise.all(methodPromises);
					});
				});
			});
			});
			
		});
		describe('/comments', () => {
			describe('/:comments_id', () => {
				describe('PATCH', () => {
					it('returns status 200 and increases the votes by the given value', () => {
						return request(app)
							.patch('/api/comments/5')
							.send({ inc_votes: 3 })
							.expect(200)
							.then(({ body }) => {
								expect(body.comment.votes).toBe(3)
							})
					});
					it('returns status 404 if comment does not exist', () => {
						return request(app)
							.patch('/api/comments/400')
							.send({ inc_votes: 3 })
							.expect(404)
							.then(({ body }) => {
								expect(body.msg).toBe('This comment does not exist');
							});
					});
					it('returns 400 for a non valid comment id', () => {
						return request(app)
							.patch('/api/comments/commentTwo')
							.send({ inc_votes: 3 })
							.expect(400)
							.then(({body}) => {
								expect(body.msg).toBe('Bad request')
						})
					});
					it('returns 400 for a non valid number of votes', () => {
						return request(app)
							.patch('/api/comments/5')
							.send({ inc_votes: 'fourteen' })
							.expect(400)
							.then(({body}) => {
								expect(body.msg).toBe('Bad request')
						})
					});
					it('returns 400 for a non valid key', () => {
						return request(app)
							.patch('/api/comments/5')
							.send({ inc_vaaaaates: 4 })
							.expect(400)
							.then(({body}) => {
								expect(body.msg).toBe('Bad request')
						})
					});
				});
				describe('DELETE', () => {
					it('returns status 204', () => {
						return request(app)
							.delete('/api/comments/11').expect(204)
					})
					it('returns a 404 for a valid but non-existant comment id', () => {
						return request(app)
						.delete('/api/comments/1000').expect(404).then(({body}) => {
							expect(body.msg).toBe('comment not found')
						})
					});
					it('returns 400 for a non valid comment id', () => {
						return request(app)
						.delete('/api/comments/commentTwo').expect(400).then(({body}) => {
							expect(body.msg).toBe('Bad request')
						})
					});
				});				
				describe('invalid method', () => {
					it('returns status 405 when given an invalid method', () => {
						const invalidMethods = ['put', 'post'];
						const methodPromises = invalidMethods.map((method) => {
							return request(app)
							[method]('/api/comments/3')
								.expect(405)
								.then(({ body }) => {
									expect(body.msg).toBe('Method not allowed');
								});
						});
						return Promise.all(methodPromises);
					});
				});
			});
			
		});
	});
});
