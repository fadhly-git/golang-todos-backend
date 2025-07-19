package controllers

import (
	"encoding/json"
	"net/http"
	"os"
	"strings"
	"time"

	"go-todo-api/config"
	"go-todo-api/models"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var jwtKey = []byte(os.Getenv("JWT_SECRET")) // ganti dengan .env nanti

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		respondWithError(w, http.StatusBadRequest, "Data tidak valid")
		return
	}

	// Hash password
	hashed, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Gagal menghash password")
		return
	}
	user.Password = string(hashed)

	// Simpan ke DB
	if err := config.DB.Create(&user).Error; err != nil {
		// Coba detect duplicate dengan cara lain
		if strings.Contains(err.Error(), "duplicate key value") {
			if strings.Contains(err.Error(), "users_username_key") {
				respondWithError(w, http.StatusConflict, "Username sudah digunakan")
				return
			}
			if strings.Contains(err.Error(), "users_email_key") {
				respondWithError(w, http.StatusConflict, "Email sudah digunakan")
				return
			}
		}
		respondWithError(w, http.StatusInternalServerError, "Gagal menyimpan user")
		return
	}

	// Sembunyikan password di response
	user.Password = ""
	respondWithJSON(w, http.StatusCreated, user)
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	_ = json.NewDecoder(r.Body).Decode(&req)

	var user models.User
	if err := config.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		http.Error(w, "Email tidak ditemukan", http.StatusUnauthorized)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		http.Error(w, "Password salah", http.StatusUnauthorized)
		return
	}

	// Buat token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	})
	tokenString, _ := token.SignedString(jwtKey)

	json.NewEncoder(w).Encode(map[string]string{
		"token": tokenString,
	})
}

func Me(w http.ResponseWriter, r *http.Request) {
	claims := r.Context().Value("user").(jwt.MapClaims)
	json.NewEncoder(w).Encode(claims)
}
