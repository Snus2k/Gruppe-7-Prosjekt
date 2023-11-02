import express, { request, response } from 'express';
import taskService from './task-service';

/**
 * Express router containing task methods.
 */
const router = express.Router();

router.get('/threads', (request, response) => {
  taskService
    .getAll()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

router.get('/threads/:id', (request, response) => {
  const id = Number(request.params.id);
  taskService
    .get(id)
    .then((task) => (task ? response.send(task) : response.status(404).send('Task not found')))
    .catch((error) => response.status(500).send(error));
});

// Example request body: { title: "Ny oppgave" }
// Example response body: { id: 4 }
router.post('/threads', (request, response) => {
  const data = request.body;
  if (
    data &&
    data.title &&
    data.title.length &&
    data.content &&
    data.content.length &&
    data.tag &&
    data.tag.length != 0
  )
    taskService
      .create(data.title, data.content, data.likes, data.tag)
      .then((threadId) => response.send({ threadId: threadId }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing thread title or content');
});

router.delete('/threads/:id', (request, response) => {
  taskService
    .delete(Number(request.params.id))
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});

router.patch('/threads/:id', (request, response) => {
  const id = Number(request.params.id);
  taskService
    .patch(id)
    .then(() => {
      response.status(204).send();
    })
    .catch((error) => {
      console.error('Feil under oppdatering:', error);
      response.status(500).send('Feil under oppdatering');
    });
});

export default router;
