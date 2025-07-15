package models

import (
	"time"
)

type Task struct {
	ID			uint      	`gorm:"primaryKey"`
	Title		string    	`gorm:"not null"`
	Description	string
	Completed 	bool 		`gorm:"default:false"`
	UserID		uint      	`gorm:"not null"`
	CreatedAt	time.Time 	    
}