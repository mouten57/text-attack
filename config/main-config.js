const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

//important to call model first, before I try to run passport
require('../db/models/Fact');
require('../db/models/Count');

const keys = require('./keys/keys');

module.exports = {
  init(app, express) {
    mongoose.connect(keys.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(
      cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey],
      })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    app.use((req, res, next) => {
      res.locals.currentUser = req.user;
      next();
    });
    app.use(express.static(path.join(__dirname, '..', 'assets')));
    app.use(logger('dev'));
  },
};
