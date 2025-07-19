package dto

type CreateTaskRequest struct {
	Title       string `json:"title" validate:"required"`
	Description string `json:"description"`
	Column      int    `json:"column" validate:"required"`
	UserID      uint   `json:"user_id" validate:"required"`
}

type UpdateTaskRequest struct {
	Title       string `json:"title" validate:"required"`
	Description string `json:"description"`
	Column      int    `json:"completed"`
}
