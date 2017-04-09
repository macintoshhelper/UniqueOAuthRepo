const qs = require('querystring');

module.exports= {
  method: 'GET',
  path: '/login',
  handler: (request, reply) => {
    var params = {
      client_id: process.env.CLIENT_ID,
    }
     reply.redirect('https://github.com/login/oauth/authorize?client_id='+ qs.parse(params))
  }
}
