import express from 'express';
import threadEditService from './threadEdit-Service';

const router = express.Router();

router.patch('/:id', (request, response) => {
  const id = Number(request.params.id);
  const { threadContent } = request.body;
  threadEditService
    .updateThread(id, threadContent)
    .then(() => response.status(204).send())
    .catch((error) => response.status(500).send(error));
});

export default router;
