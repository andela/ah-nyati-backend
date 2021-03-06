import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';
import errorhandler from 'errorhandler';
import swagger from 'swagger-ui-express';
import passport from 'passport';
import swaggerConfig from '../swagger.json';
import config from './db/config/config';
import router from './routes/index';
import triggerCronJob from './helpers/cronJobHelper';
import {
  googleStrategy, facebookStrategy, twitterStrategy, gitHubStrategy, SerializeSetUp
} from './config/social_config';


const { isProduction, port } = config;
// Create global app object
const app = express();

// It triggers the cron job
triggerCronJob();

app.use(cors());

// Normal express config defaults
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: 'authorshaven',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  }),
);
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
SerializeSetUp();
app.use(passport.initialize());
app.use(passport.session());


passport.use(googleStrategy);
passport.use(facebookStrategy);
passport.use(twitterStrategy);
passport.use(gitHubStrategy);

if (!isProduction) {
  app.use(errorhandler());
}
app.use('/api-docs', swagger.serve, swagger.setup(swaggerConfig));

app.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Welcome to Author's Haven",
  });
});
app.use(router);

// catch 404 and forward to error handler
app.use('*', (req, res, next) => {
  const err = new Error('Route Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use((err, req, res, next) => {
    if (err) {
      res.status(err.status || 500);
      return res.json({
        errors: {
          status: err.status,
          error: err.message,
        }
      });
    }
    return next();
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  if (err) {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        error: {}
      }
    });
  }
  return next();
});

// finally, let's start our server...
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${server.address().port}`);
});

export default server;
