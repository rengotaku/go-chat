package domain

import (
	log "github.com/sirupsen/logrus"

	"context"

	"github.com/rengotaku/simple_chat/src/services"
)

type Hub struct {
	Clients      map[*Client]bool
	RegisterCh   chan *Client
	UnRegisterCh chan *Client
	BroadcastCh  chan []byte
	pubsub       *services.PubSubService
}

const broadCastChan = "broadcast"

func NewHub(pubsub *services.PubSubService) *Hub {
	return &Hub{
		Clients:      make(map[*Client]bool),
		RegisterCh:   make(chan *Client),
		UnRegisterCh: make(chan *Client),
		BroadcastCh:  make(chan []byte),
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
			h.publishMessage(msg)
		}
	}
}

func (h *Hub) SubscribeMessages() {
	log.Debug("Hub:SubscribeMessages ~ start")
	ch := h.pubsub.Subscribe(context.TODO(), broadCastChan)

	for msg := range ch {
		h.broadCastToAllClient([]byte(msg.Payload))
	}
}

func (h *Hub) publishMessage(msg []byte) {
	log.Debug("Hub:publishMessage:msg ~ ", string(msg))
	h.pubsub.Publish(context.TODO(), broadCastChan, msg)
}

func (h *Hub) register(c *Client) {
	h.Clients[c] = true
	h.publishMessage([]byte("{\"type\":\"information\",\"content\":\"入室しました\"}"))
}

func (h *Hub) unregister(c *Client) {
	delete(h.Clients, c)
	h.publishMessage([]byte("{\"type\":\"information\",\"content\":\"退室しました\"}"))
}

func (h *Hub) broadCastToAllClient(msg []byte) {
	log.Debug("Hub:broadCastToAllClient:len(h.Clients) ~ ", len(h.Clients), ", ", string(msg))
	for c := range h.Clients {
		c.sendCh <- msg
	}
}
