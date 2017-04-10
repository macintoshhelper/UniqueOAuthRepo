const request = require('request');
const env = require('env2')('./config.env');
const url = require('url');
const qs = require('querystring');
const jwt = require('jsonwebtoken');


module.exports = {
  method: 'GET',
  path: '/welcome',
  handler: (req, rep) => {
    const parsedUrl = url.parse(req.url);

    const sendAuth = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: parsedUrl.query.code,
    };
    console.log(sendAuth.code);

    const options = {
      url: 'https://github.com/login/oauth/access_token',
      method: 'POST',
      body: qs.stringify(sendAuth),
    };

    request(options, (error, response, body) => {
      if (error) {
        console.log('Error:', error);
        return;
      }
      const responseBody = qs.parse(body);

      if (responseBody.access_token) {
        const githubUrl = 'https://api.github.com/user';

        const header = {
          'User-Agent': 'oauth_github_jwt',
          Authorization: `token ${responseBody.access_token}`,
        };
        request({ method: 'GET', url: githubUrl, headers: header }, (errorGet, responseGet, bodyGet) => {
          if (errorGet) {
            console.log(error);
            rep(500).error(500);
            return;
          }
          //  console.log(bodyGet);

          const optionsGet = {
            expiresIn: Date.now() + (24 * 60 * 60 * 1000),
            subject: 'github-data',
          };

          const payload = {
            user: {
              username: bodyGet.login,
              img_url: bodyGet.avatar_url,
              user_id: bodyGet.id,
            },
            accessToken: responseBody.access_token,
          };


          jwt.sign(payload, process.env.SECRET, optionsGet, (err, token) => {
          //  console.log(token);
          //  console.log('decoded token',jwt.verify(token, process.env.SECRET));
          // check that you can decode it
            rep
              .redirect('/secure') // make a new route for the redirect, config it with an authentication strategy
              .state('token', token, {
                path: '/',  // the token is valid for every path starting with /
                isHttpOnly: false,
                isSecure: process.env.NODE_ENV === 'PRODUCTION',
              });
          });
        });


        // rep('Access granted');
      } else {
        rep('Access denied');
      }
      console.log('body:', qs.parse(body)); // Print the HTML for the Google homepage.
    });
  },
};
