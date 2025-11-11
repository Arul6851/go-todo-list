import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyparser from "body-parser";
import { config } from "dotenv";
import prisma from "./middlewares/prisma";

class App {
  express: Express;

  constructor() {
    config();
    this.express = express();
    this.setMiddlewares();
    this.setRoutes();
    this.connectDatabase();
  }
  setMiddlewares(): void {
    this.express.use(express.json());
    this.express.use(bodyparser.urlencoded({ extended: false }));
    this.express.use(express.urlencoded({ extended: false }));
  }

  // Test database connection
  connectDatabase(): void {
    prisma
      .$connect()
      .then(() => console.log("Connected to MongoDB via Prisma!"))
      .catch((err: any) => {
        console.error("Database connection error:", err);
        process.exit(1);
      });
  }

  setRoutes(): void {
    this.express.use(function (
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      next();
    });
    this.express.use((req, res, next) => {
      const timestamp = new Date(Date.now()).toString();
      console.log(req.method, req.hostname, req.ip, req.path, timestamp);
      next();
    });

    this.express.get("/api/todos", async (req: Request, res: Response) => {
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
    });

    // Get todo by ID
    this.express.get("/api/todoss/:id", async (req: Request, res: Response) => {
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
    });

    // Create todo
    this.express.post("/api/todos", async (req: Request, res: Response) => {
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
    });

    // Update todo (toggle completed)
    this.express.patch(
      "/api/todos/:id",
      async (req: Request, res: Response) => {
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
      }
    );

    // Delete todo
    this.express.delete(
      "/api/todos/:id",
      async (req: Request, res: Response) => {
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
      }
    );
  }
}

export default new App().express;
