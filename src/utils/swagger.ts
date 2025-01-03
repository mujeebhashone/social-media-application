import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { logger } from './logger';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Social Media API',
      version: '1.0.0',
      description: 'API documentation for the Social Media Platform',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

export const swaggerSetup = (app: any) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  logger(null, null,'Swagger UI is running on http://localhost:5000/api-docs');
};