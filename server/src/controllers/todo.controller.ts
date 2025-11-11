import Router from "express";
import { TodosService } from "../services/todos.service";

const todos = Router();

const todosService = new TodosService();
const { getAllTodos, getTodoById, createTodo, updateTodo, deleteTodo } =
  todosService;

todos.get("/", getAllTodos);
todos.get("/:id", getTodoById);
todos.post("/", createTodo);
todos.patch("/:id", updateTodo);
todos.delete("/:id", deleteTodo);

export default todos;
