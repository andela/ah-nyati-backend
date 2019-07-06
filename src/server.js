import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';
import errorhandler from 'errorhandler';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import passport from 'passport';
import config from './db/config/config';
import {
  googleStrategy, facebookStrategy, twitterStrategy, gitHubStrategy, SerializeSetUp
} from './config/social_config';

import router from './routes/index';

const { isProduction, port } = config;

// Create global app object
const app = express();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Authors Haven',
      version: '1.0.0',
      description: 'Endpoints for Authors Haven'
    },
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        scheme: 'bearer',
        in: 'header',
      },
    },
  },
  apis: ['./routes/api/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);

app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(cors());

// Normal express config defaults
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: 'authorshaven',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
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

app.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Welcome to Author\'s Haven',
  });
});
app.use(router);

// catch 404 and forward to error handler
app.use('*', (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err
      }
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
});

// finally, let's start our server...
const server = app.listen(port, () => {
  console.log(`Listening on port ${server.address().port}`);
});

export default server;
