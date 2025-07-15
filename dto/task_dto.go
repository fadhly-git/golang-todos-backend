package dto

type CreateTaskRequest struct {
	Title       string `json:"title" validate:"required"`
	Description string `json:"description"`
	Completed   bool   `json:"completed"`
}

type UpdateTaskRequest struct {
	Title       string `json:"title" validate:"required"`
	Description string `json:"description"`
	Completed   bool   `json:"completed"`
}
