package handlers

import (
	"log"
	"net/http"

	// "encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/rengotaku/simple_chat/src/auth"
	"github.com/rengotaku/simple_chat/src/models"
)

type RoomHandler struct {
}

type RoomCreatePrams struct {
	Title    string `json:"title"`
	Password string `json:"password"`
}

func NewRoomHandler() *RoomHandler {
	return &RoomHandler{}
}

// Show Room
func (h *RoomHandler) ShowHandle(c *gin.Context) {
	db, err := models.Connection()
	if err != nil {
		log.Fatal(err)
	}

	log.Print("roomId: ", c.Param("roomId"))
	var room models.Room
	// db.First(&room, 6)
	db.Where("room_id = ?", c.Param("roomId")).First(&room)

	if room.State == int(models.Closed) {
		c.JSON(http.StatusNotFound, gin.H{
			"errorMessage": "Not found room.",
		})
		return
	}

	var claim *auth.Claims
	bearer := c.Query("bearer")

	if bearer == "" {
		uname := c.Query("username")

		if uname == "" {
			c.JSON(http.StatusNotFound, gin.H{
				"errorMessage": "Not found room.",
			})
			return
		}

		claim = &auth.Claims{
			ID:     generateUuid()[0:5],
			Name:   uname,
			RoomID: room.RoomId,
		}

		bearer, err = auth.CreateJWTToken(*claim)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"errorMessage": "Not found room.",
			})
			return
		}
	} else {
		claim, err = auth.ValidateToken(bearer)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"errorMessage": "Not found room.",
			})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"title":    room.Title,
		"uuid":     claim.GetId(),
		"username": claim.GetName(),
		"bearer":   bearer,
	})
}

// Create Room
func (h *RoomHandler) CreateHandle(c *gin.Context) {
	uuid := generateUuid()

	db, err := models.Connection()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"errorMessage": err.Error(),
		})
		return
	}

	var params RoomCreatePrams
	err = c.BindJSON(&params)
	if err != nil {
		log.Print(err)

		c.JSON(http.StatusInternalServerError, gin.H{
			"errorMessage": err.Error(),
		})
		return
	}

	room := models.Room{RoomId: uuid, Title: params.Title, Password: params.Password, State: int(models.Opend)}

	validate := validator.New()
	err = validate.Struct(room)
	if err != nil {
		if _, ok := err.(*validator.InvalidValidationError); ok {
			log.Print(err)
		}
		log.Print("err:", err)

		c.JSON(http.StatusInternalServerError, gin.H{
			"errorMessage": err.Error(),
		})
		return
	}

	rel := db.Create(&room)
	if rel.Error != nil {
		log.Print(rel.Error)

		c.JSON(http.StatusInternalServerError, gin.H{
			"errorMessage": rel.Error.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"roomId": uuid,
	})
}

func generateUuid() string {
	return uuid.NewString()
}
