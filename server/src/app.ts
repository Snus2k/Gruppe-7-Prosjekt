import express from 'express';
import taskRouter from './task-router';
import threadEditRouter from './threadEdit-router';

/**
 * Express application.
 */
const app = express();

app.use(express.json());

// Since API is not compatible with v1, API version is increased to v2
app.use('/api/v2', taskRouter);
app.use('/api/v2/edit/threads', threadEditRouter);

export default app;
