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
				});
				describe('invalid method', () => {
					it('returns status 405 when given an invalid method', () => {
						const invalidMethods = ['post', 'put'];
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
					it('returns status 200 and increases the votes by the given value', () => {
						return request(app)
							.patch('/api/articles/11')
							.send({ username: 'icellusedkars', body: 'I wish I was a cat' })
							.expect(201)
							.then(({ body }) => {
								expect(body.article.comments[1]).toBe('I wish I was a cat')
							})
					});
				})
			});
			});
			
		});
	});
});
