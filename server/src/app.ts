import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyparser from "body-parser";
import { config } from "dotenv";

class App {
  express: Express;

  constructor() {
    config();
    this.express = express();
    this.setMiddlewares();
    this.setRoutes();
  }

  setMiddlewares(): void {
    this.express.use(
      cors({
        origin: "*",
        credentials: true,
      })
    );
    this.express.options("*", cors());
    this.express.use(express.json());
    this.express.use(bodyparser.urlencoded({ extended: false }));
    this.express.use(express.urlencoded({ extended: false }));
  }

  setRoutes(): void {
    this.express.all(
      "/*",
      function (req: Request, res: Response, next: NextFunction) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
      }
    );
    this.express.use((req, res, next) => {
      const timestamp = new Date(Date.now()).toString();
      console.log(req.method, req.hostname, req.ip, req.path, timestamp);
      next();
    });
  }
}

export default new App().express;
