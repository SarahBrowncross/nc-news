const app = require('../app.js')
const request = require('supertest')
const connection = require('../db/connection')

afterAll(() => {
	return connection.destroy();
})


describe('app', () => {
	describe('/api', () => {
		describe('/topics', () => {
			describe('GET', () => {
				it('returns status 200 and an object containing an array of topics', () => {
					return request(app).get('/api/topics').expect(200)
					.then(({body}) => {
						expect(body.topics).toHaveLength(3)
						expect(Object.keys(body.topics[0])).toEqual(expect.arrayContaining([
							'description', 'slug'
						]))
					})
				});
			});
		});
	});
	
});