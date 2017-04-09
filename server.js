const hapi = require('hapi');
const inert = require('inert');

const server = new hapi.Server();

server.connection({
  port: process.env.PORT || 3000,
})

server.register([inert], (err) => {
  if (err) throw err;

  server.route({
    method: 'GET',
    path: '/',
    handler: {
      file: {
        path: 'public/index.html'
      }
    }
  })

  server.start((err) => {
    if (err) throw err;
    console.log(`Server running on ${server.info.uri}`);
  })
});
