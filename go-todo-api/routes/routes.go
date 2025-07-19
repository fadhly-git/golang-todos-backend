package routes

import (
	"github.com/gorilla/mux"

	"go-todo-api/controllers"
	"go-todo-api/middleware"
)

func SetupRouter() *mux.Router {
	r := mux.NewRouter()

	// sample route
	r.HandleFunc("/ping", controllers.PingHandler).Methods("GET")
	r.HandleFunc("/auth/register", controllers.RegisterHandler).Methods("POST")
	r.HandleFunc("/auth/login", controllers.LoginHandler).Methods("POST")

	// group routes yang memerlukan autentikasi
	protected := r.PathPrefix("/api").Subrouter()
	protected.Use(middleware.JWTAuth) // gunakan middleware untuk autentikasi

	// protected route
	protected.HandleFunc("/me", controllers.Me).Methods("GET")

	// task routes
	protected.HandleFunc("/tasks", controllers.CreateTaskHandler).Methods("POST")
	protected.HandleFunc("/tasks", controllers.GetAllTasksHandler).Methods("GET")
	protected.HandleFunc("/tasks/{id}", controllers.GetTaskHandler).Methods("GET")
	protected.HandleFunc("/tasks/{id}", controllers.UpdateTaskHandler).Methods("PUT")
	protected.HandleFunc("/tasks/{id}", controllers.DeleteTaskHandler).Methods("DELETE")
	protected.HandleFunc("/tasks/{id}/status", controllers.UpdateTaskStatusHandler).Methods("PATCH")

	return r
}
