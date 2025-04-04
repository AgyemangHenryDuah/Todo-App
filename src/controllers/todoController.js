import { TodoModel } from '../models/todoModel.js';

export const TodoController = {
  async index(req, res, next) {
    try {
      const todos = await TodoModel.getAll();
      res.render('index', { todos });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      if (!req.body.title || !req.body.description) {
        const error = new Error('Title and description are required');
        error.status = 400;
        throw error;
      }

      const todo = await TodoModel.create(req.body);
      res.status(201).json(todo);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      if (!req.body.title || !req.body.description || !req.body.status) {
        const error = new Error('Title, description, and status are required');
        error.status = 400;
        throw error;
      }

      const todo = await TodoModel.update(req.params.id, req.body);
      if (!todo) {
        const error = new Error('Todo not found');
        error.status = 404;
        throw error;
      }
      res.json(todo);
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      await TodoModel.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};