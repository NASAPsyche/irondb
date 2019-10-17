const request = require('supertest');
const app = require('../controller/app');

describe('Test the example path', () => {
// eslint-disable-next-line max-len
  test('It should respond to the GET method with example.ejs template and 200 status.',
      (done) => {
        request(app).get('/example').then((response) => {
          expect(response.statusCode).toBe(200);
          expect(response.text).toMatch(/Example Route/);
          done();
        });
      });
});
