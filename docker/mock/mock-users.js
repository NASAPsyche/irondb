/**
 * This populates the user table with some mock users.
 * @author Ken Bonilla 2019
 */

const request = require('request');


request.post(
    'http://localhost:3001/register',
    {json: {username: 'user1', password: 'password'}},
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(response);
      }
    }
);

request.post(
    'http://localhost:3001/register',
    {json: {username: 'user2', password: 'password'}},
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(response);
      }
    }
);

request.post(
    'http://localhost:3001/register',
    {json: {username: 'user3', password: 'password'}},
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(response);
      }
    }
);

