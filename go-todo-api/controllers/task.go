package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"go-todo-api/config"
	"go-todo-api/dto"
	"go-todo-api/models"

	"github.com/gorilla/mux"
)

func CreateTaskHandler(w http.ResponseWriter, r *http.Request) {
	var body dto.CreateTaskRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Data tidak valid", http.StatusBadRequest)
		return
	}

	userID, err := GetUserIDFromContext(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	task := models.Task{
		Title:       body.Title,
		Description: body.Description,
		Status:      body.Column,
		UserID:      userID,
	}

	if err := config.DB.Create(&task).Error; err != nil {
		http.Error(w, "Gagal simpan task", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(task)
}

func GetAllTasksHandler(w http.ResponseWriter, r *http.Request) {
	userID, err := GetUserIDFromContext(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Query params
	query := r.URL.Query()
	completed := query.Get("completed") // true / false / empty
	pageStr := query.Get("page")        // page number
	limitStr := query.Get("limit")      // items per page
	sortStr := query.Get("sort")        // e.g. created_at,desc

	page := 1
	limit := 10
	sortField := "created_at"
	sortOrder := "desc"

	if pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			page = p
		}
	}
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
	}
	if sortStr != "" {
		parts := strings.Split(sortStr, ",")
		if len(parts) == 2 {
			sortField = parts[0]
			if parts[1] == "asc" || parts[1] == "desc" {
				sortOrder = parts[1]
			}
		}
	}

	offset := (page - 1) * limit

	// Query builder
	db := config.DB.Model(&models.Task{}).Where("user_id = ?", userID)

	if completed == "true" {
		db = db.Where("completed = true")
	} else if completed == "false" {
		db = db.Where("completed = false")
	}

	var tasks []models.Task
	if err := db.Order(sortField + " " + sortOrder).
		Limit(limit).
		Offset(offset).
		Find(&tasks).Error; err != nil {
		http.Error(w, "Gagal mengambil data: "+err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(tasks)
}

func GetTaskHandler(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	userID, _ := GetUserIDFromContext(r)

	var task models.Task
	result := config.DB.Where("id = ? AND user_id = ?", id, userID).First(&task)
	if result.Error != nil {
		http.Error(w, "Task tidak ditemukan", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(task)
}

func UpdateTaskHandler(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	userID, _ := GetUserIDFromContext(r)

	var task models.Task
	result := config.DB.Where("id = ? AND user_id = ?", id, userID).First(&task)
	if result.Error != nil {
		http.Error(w, "Task tidak ditemukan", http.StatusNotFound)
		return
	}

	var body dto.UpdateTaskRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Data tidak valid", http.StatusBadRequest)
		return
	}

	task.Title = body.Title
	task.Description = body.Description
	task.Status = body.Column

	if err := config.DB.Save(&task).Error; err != nil {
		http.Error(w, "Gagal update", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(task)
}

func DeleteTaskHandler(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	userID, _ := GetUserIDFromContext(r)

	var task models.Task
	result := config.DB.Where("id = ? AND user_id = ?", id, userID).First(&task)
	if result.Error != nil {
		http.Error(w, "Task tidak ditemukan", http.StatusNotFound)
		return
	}

	config.DB.Delete(&task)
	w.WriteHeader(http.StatusNoContent)
}
