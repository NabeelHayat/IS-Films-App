import express from 'express';
import path from 'path';

import apiRouter from './api';

const api = express.Router();

api.use('/api/v1', apiRouter);

// Example: http://localhost:5000/favicon.ico => Display "~/docs/statics/favicon.png"
api.use(express.static(path.join(__dirname, './../../../')));

/** GET /health-check - Check service health */
api.get('/health-check', (req, res) => res.send('OK'));

// For any other routes, redirect to the index.html file of React
api.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, './../../../client/build/index.html'));
});

export default api;
