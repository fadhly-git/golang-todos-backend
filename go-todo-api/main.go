package main

import (
	"log"
	"net/http"
	"os"

	"go-todo-api/config"
	"go-todo-api/middleware"
	"go-todo-api/routes"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file, using default values")
	}
	config.ConnectDB()
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port if not set in .env
		log.Println("Using default PORT:", port)
		os.Setenv("PORT", port)
	} else {
		log.Println("Using PORT from .env:", port)
	}
	r := routes.SetupRouter()
	handlerWithCORS := middleware.EnableCORS(r)

	log.Println("Starting server on :" + port)
	log.Fatal(http.ListenAndServe(":" + port, handlerWithCORS))

}