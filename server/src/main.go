package main

import (
	// "fmt"

	"log"
	"net/http"
	"os"

	"github.com/rengotaku/simple_chat/src/domain"
	"github.com/rengotaku/simple_chat/src/handlers"
	"github.com/rengotaku/simple_chat/src/models"
	"github.com/rengotaku/simple_chat/src/services"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

type config struct {
	FrontendUrl string `env:"FRONTEND_URL"`
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", os.Getenv("FRONTEND_URL"))
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func init() {
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	models.InitMigration()

	pubsub := services.NewPubSubService()
	hub := domain.NewHub(pubsub)
	go hub.SubscribeMessages()
	go hub.RunLoop()

	r := gin.Default()
	r.Use(CORSMiddleware())

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	r.GET("/ws", handlers.NewWebsocketHandler(hub).Handle)
	r.POST("/room", handlers.NewRoomHandler().CreateHandle)
	r.GET("/room/:roomId", handlers.NewRoomHandler().ShowHandle)

	err := r.Run(":80")
	if err != nil {
		log.Panicln("[Error] failed to start Gin server due to: " + err.Error())
	}
}
