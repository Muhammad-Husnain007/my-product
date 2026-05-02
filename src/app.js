// src/app.js
import express from 'express';
import cookieParser from 'cookie-parser';
import corsMiddleware from '../config/cors.config.js';
import apiRouter from './modules/routes/index.js';
// import globalLogger from '../config/globalLogger.config.js';
import {apiAuditLogger} from "./modules/apiAuditLogs/apiAudit.middleware.js";

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
// app.use(globalLogger)
app.use(apiAuditLogger);


// Root route
app.get('/', (req, res) => res.send('Server is ready'));

app.use('/api/v1', apiRouter);

export { app };
