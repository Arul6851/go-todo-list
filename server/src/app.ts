import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyparser from "body-parser";
import { config } from "dotenv";
import prisma from "./middlewares/prisma";
import todosRouter from "./routers/todos.route";
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
    this.express.use("/api/todos", todosRouter);
  }
}

export default new App().express;
