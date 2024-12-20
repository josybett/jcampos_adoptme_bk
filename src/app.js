import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import compression from 'express-compression';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

import { errorHandler } from './middlewares/errors/index.js';
import { addLogger } from './utils/logger.js';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';

mongoose.set('strictQuery', false);
process.loadEnvFile()
const app = express();
const PORT = process.env.PORT||8080;
const connection = mongoose.connect(process.env.MONGO_URL)
const swaggerOptions = {
  definition: {
      openapi: '3.0.1',
      info: {
          title: 'Documentación de AdoptMe JCampos API',
          description: 'API de proyecto para adoptar mascotas'
      }
  },
  // apis: [`./src/routes/*.js`]
  apis: [`./src/docs/**/*.yaml`]
}
const specs = swaggerJSDoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.use(addLogger);
app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(errorHandler);


app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/api/mocks',mocksRouter);

app.listen(PORT,()=>console.log(`Listening on ${PORT}`))
