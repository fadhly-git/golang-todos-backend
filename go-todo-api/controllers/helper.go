package controllers

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
)

func GetUserIDFromContext(r *http.Request) (uint, error) {
	claims, ok := r.Context().Value("user").(jwt.MapClaims)
	if !ok {
		return 0, errors.New("no jwt claims in context")
	}

	idFloat, ok := claims["user_id"].(float64)
	if !ok {
		return 0, errors.New("invalid user_id type")
	}

	return uint(idFloat), nil
}

func respondWithError(w http.ResponseWriter, code int, message string) {
	respondWithJSON(w, code, map[string]string{"error": message})
}

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(payload)
}
