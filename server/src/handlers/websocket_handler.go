package handlers

import (
	"log"
	"net/http"

	"github.com/rengotaku/simple_chat/src/domain"
	"github.com/gorilla/websocket"

	"github.com/gin-gonic/gin"
	"github.com/rengotaku/simple_chat/src/models"

)

type WebsocketHandler struct {
	hub *domain.Hub
}

func NewWebsocketHandler(hub *domain.Hub) *WebsocketHandler {
	return &WebsocketHandler{
		hub: hub,
	}
}

func (h *WebsocketHandler) Handle(c *gin.Context) {
	db, err := models.Connection()
	if err != nil {
		log.Fatal(err)
	}

	var count int64
	db.Model(&models.Room{}).Where("room_id = ?", c.Query("roomId")).Count(&count)

	if count == 0 {
		c.JSON(http.StatusNotFound, gin.H{})
		return
	}

	upgrader := &websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	ws, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Fatal(err)
	}

	client := domain.NewClient(ws)
	go client.ReadLoop(h.hub.BroadcastCh, h.hub.UnRegisterCh)
	go client.WriteLoop()
	h.hub.RegisterCh <- client
}
