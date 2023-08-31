package domain

import (
	log "github.com/sirupsen/logrus"

	"context"

	"github.com/rengotaku/simple_chat/src/models"
	"github.com/rengotaku/simple_chat/src/services"
)

type Hub struct {
	RegisterCh   chan *Client
	UnRegisterCh chan *Client
	BroadcastCh  chan *Message
	Rooms        map[*models.Room]map[*Client]bool
	pubsub       *services.PubSubService
}

func NewHub(pubsub *services.PubSubService) *Hub {
	return &Hub{
		RegisterCh:   make(chan *Client),
		UnRegisterCh: make(chan *Client),
		BroadcastCh:  make(chan *Message),
		Rooms:        make(map[*models.Room]map[*Client]bool),
		pubsub:       pubsub,
	}
}

func (h *Hub) RunLoop() {
	log.Debug("Hub:RunLoop ~ start")

	for {
		select {
		case client := <-h.RegisterCh:
			log.Debug("Hub:RunLoop:register ~ start")
			h.register(client)

		case client := <-h.UnRegisterCh:
			log.Debug("Hub:RunLoop:unregister ~ start")
			h.unregister(client)

		case msg := <-h.BroadcastCh:
			log.Debug("Hub:RunLoop:publishMessage ~ start")
			h.publishMessage(msg.Message, &msg.Client.Room)
		}
	}
}

func (h *Hub) SubscribeMessages(room *models.Room) {
	log.Debug("Hub:SubscribeMessages ~ start")
	ch := h.pubsub.Subscribe(context.TODO(), room.RoomId)

	for msg := range ch {
		h.broadCastToAllClient([]byte(msg.Payload), room)
	}
}

func (h *Hub) publishMessage(msg []byte, room *models.Room) {
	log.Debug("Hub:publishMessage:msg ~ ", string(msg))
	h.pubsub.Publish(context.TODO(), room.RoomId, msg)
}

func (h *Hub) register(c *Client) {
	h.publishMessage([]byte("{\"type\":\"information\",\"content\":\"入室しました\"}"), &c.Room)
}

func (h *Hub) unregister(c *Client) {
	delete(h.Rooms[&c.Room], c)

	if len(h.Rooms[&c.Room]) == 0 {
		h.Rooms[&c.Room] = nil
	}
	h.publishMessage([]byte("{\"type\":\"information\",\"content\":\"退室しました\"}"), &c.Room)
}

func (h *Hub) broadCastToAllClient(msg []byte, room *models.Room) {
	log.Debug("Hub:broadCastToAllClient:len(h.Clients) ~ ", len(h.Rooms[room]), ", ", string(msg))

	for c := range h.Rooms[room] {
		c.sendCh <- msg
	}
}
