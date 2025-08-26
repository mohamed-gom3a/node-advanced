const passport = require('passport');

module.exports = app => {
  app.get(
    '/auth/google',
    (req, res, next) => {
      console.log('Google OAuth login attempt');
      console.log('Request URL:', req.url);
      console.log('Request headers:', req.headers);
      next();
    },
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      console.log('Google OAuth callback - redirecting to React app');
      console.log('User authenticated:', req.user);
      res.redirect('http://localhost:3000/blogs');
    }
  );

  app.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('http://localhost:3000/');
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
