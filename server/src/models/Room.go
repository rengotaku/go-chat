package models

import (
	"gorm.io/gorm"
)

type RoomState int64

const (
	Closed RoomState = iota
	Opend
)

type Room struct {
	gorm.Model

	RoomId   string `gorm:"type:text;not null;" validate:"required"`
	Title    string `gorm:"type:text;not null;" validate:"required"`
	Password string `gorm:"type:text;not null;" validate:"required"`
	// ReserveID  uint
	// Reserve    Reserve `gorm:"association_autoupdate:false;association_autocreate:false"`
	// Html       string  `gorm:"type:text;"`
	State int `gorm:"default:1" validate:"required"` // 0: closed, 1: opened
}
