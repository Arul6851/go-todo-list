package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
)

type Todo struct {
	ID        int    `json:"id"`
	Completed bool   `json:"completed"`
	Body      string `json:"body"`
}

func main() {
	fmt.Println("Hello, World!")
	app := fiber.New()
	todos := []Todo{}

	// Get all Todos
	app.Get("/", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(todos)
	})

	// Create a Todo
	app.Post("/", func(c *fiber.Ctx) error {
		todo := &Todo{}
		if err := c.BodyParser(&todo); err != nil {
			return c.Status(400).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		if todo.Body == "" {
			return c.Status(400).JSON(fiber.Map{
				"error": "Body is required",
			})
		}

		todo.ID = len(todos) + 1
		todos = append(todos, *todo)

		return c.Status(201).JSON(todo)
	})

	//Update a Todo
	app.Patch("/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")

		for i, todo := range todos {
			if fmt.Sprint(todo.ID) == id {
				todos[i].Completed = true
				return c.Status(200).JSON(todos[i])
			}
		}
		return c.Status(404).JSON(fiber.Map{
			"error": "Todo not found",
		})
	})

	// Delete a Todo
	app.Delete("/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		for i, todo := range todos {
			if fmt.Sprint(todo.ID) == id {
				todos = append(todos[:i], todos[i+1:]...)
				return c.SendStatus(204)
			}
		}
		return c.Status(404).JSON(fiber.Map{
			"error": "Todo not found",
		})
	})

	log.Fatal(app.Listen(":3000"))
}
