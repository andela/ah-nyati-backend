import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';
import errorhandler from 'errorhandler';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import config from './db/config/config';
import router from './routes/index';

const { isProduction, port, } = config;

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
// finally, let's start our server...
const server = app.listen(port, () => {
  console.log(`Listening on port ${server.address().port}`);
});

export default server;
