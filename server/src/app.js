import express    from 'express';
import bodyParser from 'body-parser';
import morgan     from 'morgan';
import path       from 'path';
import mongoose   from 'mongoose';

import config from './config';
import routes     from './routes';
import passport   from './services/passport';

const app          = express();

// HTTP request logger middleware for development environment.
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// DB Config
const dbConnection = config.DATATBASE_URL;

// Connect to Mongo
mongoose
  .connect(dbConnection, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('MongoDB Connected...');
    // seedDb();
  })
  .catch((err) => console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Example: http://localhost:3000/favicon.ico => Display "~/docs/statics/favicon.png"
app.use(express.static(path.join(__dirname, './../../client/build')));
// For any other routes, redirect to the index.html file of React
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './../../client/build/index.html'));
});

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
