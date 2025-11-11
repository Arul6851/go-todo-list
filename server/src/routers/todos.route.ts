import { Router } from "express";
import todos from "../controllers/todo.controller";

export const todosRouter = Router();
todosRouter.use("/todos", todos);

export default todosRouter;
