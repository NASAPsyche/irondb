const fetch = require('node-fetch');

const url = 'http://localhost:3001/register';
const data = {
  username: 'user6',
  password: 'password',
};


fetch(url, {
  method: 'POST',
  body: JSON.stringify(data),
}).then((res) => {
  console.log(res);
}).catch((error) => console.log(error) );
