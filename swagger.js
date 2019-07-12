import swaggerJSDoc from 'swagger-jsdoc';


// swagger definition
const swaggerDefinition = {
  info: {
    title: 'Authors Haven Documentation',
    version: '1.0.0',
    description:
      'Endpoints for Authors Haven',
  },
  host: 'localhost:3000',
  basePath: '/api',
  schemes: ['https', 'http'],
  securityDefinitions: {
    jwt: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
    },
  },
  security: [{ jwt: [] }],
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  apis: ['./src/routes/*.js', './src/ models/*.js'], // pass all in array
});
export default swaggerSpec;
