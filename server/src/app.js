import express    from 'express';
import bodyParser from 'body-parser';
import morgan     from 'morgan';
import path       from 'path';

import routes     from './routes';
import passport   from './services/passport';

const app          = express();

// HTTP request logger middleware for development environment.
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Example: http://localhost:5000/favicon.ico => Display "~/docs/statics/favicon.png"
app.use(express.static(path.join(__dirname, 'dist')));

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

passport({ app });

/**
 * -------------- ROUTES ----------------
 */

// mount all routes
app.use('/', routes);

export default app;
