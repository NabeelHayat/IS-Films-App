import express from 'express';
import path from 'path';

import apiRouter from './api';

const api = express.Router();

api.use('/api/v1', apiRouter);

/** GET /health-check - Check service health */
api.get('/health-check', (req, res) => res.send('OK'));

export default api;
