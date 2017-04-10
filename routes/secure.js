const secure = {
  method: 'GET',
  path: '/secure',
  config: { auth: 'jwt' },
  handler: (req, rep) => {
    rep('It works!');
  },
};

module.exports = secure;
