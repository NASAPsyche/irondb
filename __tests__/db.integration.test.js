const request = require('supertest');
const app = require('../controller/app');

// Test assuming original example database inserts, when updated update test
// Remove skip on test to run.
// Must have app running via docker so database container is running.
// Supertest often continues running post test to exit, interupt with control+c
describe('Integration test for /database path (Note: must be running app via docker when ran to pass.)', () => {
    test.skip('It should respond to the GET method with database.ejs template and 200 status.', (done) => {
        request(app).get('/database').then((response) => {
            expect(response.statusCode).toBe(200);
            expect(response.text).toMatch(/Psyche/);
            done();
        });
    });
});
