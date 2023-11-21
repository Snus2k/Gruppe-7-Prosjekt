import express, { request, response } from 'express';
import taskService from './task-service';

/**
 * Express router containing task methods.
 */
const router = express.Router();

router.patch('/edit/threads/:id', (request, response) => {
  console.log('hei fra router.patch');

  const id = Number(request.params.id);
  const { title, content, tag } = request.body;
  taskService
    .updateThread(id, title, content, tag)
    .then(() => response.status(204).send())
    .catch((error) => response.status(500).send(error));
});

export default router;
