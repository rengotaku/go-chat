package handlers

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/rengotaku/simple_chat/src/auth"
	"github.com/rengotaku/simple_chat/src/domain"

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

	bearer := c.Query("bearer")

	if bearer == "" {
		c.JSON(http.StatusNotFound, gin.H{})
	}

	claim, err := auth.ValidateToken(bearer)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"errorMessage": "Not found room.",
		})
		return
	}

	var room *models.Room
	db.Model(&models.Room{}).Where("room_id = ?", claim.RoomID).First(&room)

	if room == nil {
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

	client := domain.NewClient(claim.GetName(), claim.GetId(), *room, ws)

	if clns, ok := h.hub.Rooms[room]; ok { // exists room already
		clns[client] = true
	} else {
		h.hub.Rooms[room] = map[*domain.Client]bool{client: true}

		go h.hub.SubscribeMessages(room)
	}

	go client.ReadLoop(h.hub.BroadcastCh, h.hub.UnRegisterCh)
	go client.WriteLoop()
	h.hub.RegisterCh <- client
}
