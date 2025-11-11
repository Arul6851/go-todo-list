import { Request, Response } from "express";
import prisma from "../middlewares/prisma";

export class TodosService {
  getAllTodos = async (req: Request, res: Response) => {
    try {
      const todos = await prisma.todos.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
      res.status(200).json(todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
      res.status(500).json({ error: "Failed to fetch todos" });
    }
  };

  // Get todo by ID
  getTodoById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const todo = await prisma.todos.findUnique({
        where: { id },
      });

      if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
      }

      res.status(200).json(todo);
    } catch (error) {
      console.error("Error fetching todo:", error);
      res.status(500).json({ error: "Failed to fetch todo" });
    }
  };

  // Create todo
  createTodo = async (req: Request, res: Response) => {
    try {
      const { body } = req.body;

      if (!body || body.trim() === "") {
        return res.status(400).json({ error: "Body is required" });
      }

      const todo = await prisma.todos.create({
        data: {
          body,
          completed: false,
        },
      });

      res.status(201).json(todo);
    } catch (error) {
      console.error("Error creating todo:", error);
      res.status(500).json({ error: "Failed to create todo" });
    }
  };

  // Update todo (toggle completed)
  updateTodo = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { completed } = req.body;

      // If completed is provided in body, use it; otherwise toggle to true
      const todo = await prisma.todos.update({
        where: { id },
        data: {
          completed: completed !== undefined ? completed : true,
        },
      });

      res.status(200).json({ message: "Todo updated successfully", todo });
    } catch (error) {
      console.error("Error updating todo:", error);
      res.status(404).json({ error: "Todo not found" });
    }
  };

  // Delete todo
  deleteTodo = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      await prisma.todos.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting todo:", error);
      res.status(404).json({ error: "Todo not found" });
    }
  };
}
