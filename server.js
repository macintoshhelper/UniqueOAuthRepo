const hapi = require('hapi');
const inert = require('inert');
const fs = require('fs');
const routes = require('./routes/index.js');
const jwt = require('hapi-auth-jwt2');

const server = new hapi.Server();


const options = {
  key: fs.readFileSync('./keys/key.pem'),
  cert: fs.readFileSync('./keys/cert.pem'),
};

const people = { // our "users database", use your github details here
  6757532: {
    id: 6757532,
    name: 'macintoshhelper',
  },
};

server.connection({
  port: process.env.PORT || 3000,
  tls: options,
});


function validate(token, request, callback) {
  console.log(token.user); // decoded token, it automaitcally decodes it
  if (!people[token.user.user_id]) {
    return callback(null, false);
  }
  return callback(null, true);
}

server.register([inert, jwt], (err) => {
  if (err) throw err;

  server.auth.strategy('jwt', 'jwt', {
    key: process.env.SECRET,
    validateFunc: validate,
    verifyOptions: { algorithms: ['HS256'] },
  });

  server.route(routes);

  server.start((startErr) => {
    if (startErr) throw err;
    console.log(`Server running on ${server.info.uri}`);
  });
});
