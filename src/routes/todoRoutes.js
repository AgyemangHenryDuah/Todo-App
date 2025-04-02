import express from 'express';
import { TodoController } from '../controllers/todoController.js';

const router = express.Router();

router.get('/', TodoController.index);
router.post('/todos', TodoController.create);
router.put('/todos/:id', TodoController.update);
router.delete('/todos/:id', TodoController.delete);

export default router;