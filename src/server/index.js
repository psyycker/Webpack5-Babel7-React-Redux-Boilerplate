import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import setupApiRoutes from './middlewares/api';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.HTTP_PORT = process.env.HTTP_PORT || 3000;

function onUnhandledError(err) {
  try {
    console.error(err);
  } catch (e) {
    console.log('LOGGER ERROR:', e); // eslint-disable-line no-console
    console.log('APPLICATION ERROR:', err); // eslint-disable-line no-console
  }
  process.exit(1);
}

process.on('unhandledRejection', onUnhandledError);
process.on('uncaughtException', onUnhandledError);

const setupAppRoutes =
  process.env.NODE_ENV === 'development'
    ? require('./middlewares/development')
    : require('./middlewares/production');

const app = express();

app.set('env', process.env.NODE_ENV);

app.use(bodyParser.json());

// application routes
setupApiRoutes(app);
setupAppRoutes(app);

http.createServer(app).listen(process.env.HTTP_PORT, () => {
  console.log(
    `HTTP server is now running on http://localhost:${process.env.HTTP_PORT}`
  );
});
