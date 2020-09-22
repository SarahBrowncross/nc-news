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
  });
});
