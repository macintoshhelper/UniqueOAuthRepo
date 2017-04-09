const hapi = require('hapi');
const inert = require('inert');
const fs = require('fs');
const routes = require('./routes/index.js');

const server = new hapi.Server();


const options = {
  key: fs.readFileSync('./keys/key.pem'),
  cert: fs.readFileSync('./keys/cert.pem')
}
server.connection({
  port: process.env.PORT || 3000,
  tls: options
})

server.register([inert], (err) => {
  if (err) throw err;

  server.route(routes)

  server.start((err) => {
    if (err) throw err;
    console.log(`Server running on ${server.info.uri}`);
  })
});
