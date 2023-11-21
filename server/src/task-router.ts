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

router.get('/Subthreads/:id', (request, response) => {
  const id = Number(request.params.id);
  taskService
    .getSubthreads(id)
    .then((subthread) =>
      subthread ? response.send(subthread) : response.status(404).send('Subthread not found'),
    )
    .catch((error) => {
      console.error(error);
      response.status(500).send('Internal Server Error');
    });
});

router.post('/Subthreads/:id', (request, response) => {
  const data = request.body;

  if (
    data &&
    data.subthreadContent &&
    data.subthreadContent.length &&
    data.threadId &&
    data.threadId != 0
  ) {
    taskService
      .createComment(data.subthreadContent, data.likes, data.threadId)
      .then((threadId) => response.send({ threadId: threadId }))
      .catch((error) => response.status(500).send(error));
  } else response.status(400).send('Missing content');
});
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
router.delete('/subthreads/:subthreadId', (request, response) => {
  taskService
    .deleteComment(Number(request.params.subthreadId))
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});

router.patch('/threads/:id', (request, response) => {
  const id = Number(request.params.id);
  const likes = request.body.likes;
  taskService
    .updateLikes(id, likes)
    .then(() => response.status(204).send())
    .catch((error) => response.status(500).send(error));
});

router.patch('/subthreads/:subthreadId', (request, response) => {
  const id = Number(request.params.subthreadId);
  const likes = request.body.likes;
  taskService
    .updateCommentLikes(id, likes)
    .then(() => response.status(204).send())
    .catch((error) => response.status(500).send(error));
});

router.patch('/B/threads/:id', (request, response) => {
  console.log('hei fra router.patch');

  const id = Number(request.params.id);
  const { title, content, tag } = request.body;
  taskService
    .updateThread(id, title, content, tag)
    .then(() => response.status(204).send())
    .catch((error) => response.status(500).send(error));
});

export default router;
