const request = require('request');
const env = require('env2')('./config.env');
const url = require('url');
const qs = require('querystring');


module.exports = {
  method: 'GET',
  path: '/welcome',
  handler: (req, rep) => {
    var parsedUrl = url.parse(req.url);

    var sendAuth = {
      'client_id': process.env.CLIENT_ID,
      'client_secret': process.env.CLIENT_SECRET,
      'code': parsedUrl.query.code
    }
    console.log(sendAuth.code);

    var options = {
      url: 'https://github.com/login/oauth/access_token',
      'method': 'POST',
      'body': qs.stringify(sendAuth)
    };

    request(options, function (error, response, body) {
      if (error) {
        console.log('Error:', error);
        return;
      }
      var responseBody = qs.parse(body);

      if (responseBody.access_token) {
        rep('Access granted');
      } else {
        rep('Access denied');
      }
      console.log('body:', qs.parse(body)); // Print the HTML for the Google homepage.
    });
  }
}
