package domain

import (
	log "github.com/sirupsen/logrus"

	"github.com/gorilla/websocket"
)

type Client struct {
	ws     *websocket.Conn
	sendCh chan []byte
}

func NewClient(ws *websocket.Conn) *Client {
	return &Client{
		ws:     ws,
		sendCh: make(chan []byte),
	}
}

func (c *Client) ReadLoop(broadCast chan<- []byte, unregister chan<- *Client) {
	log.Debug("Client:ReadLoop ~ start")

	defer func() {
		c.disconnect(unregister)
	}()

	for {
		_, jsonMsg, err := c.ws.ReadMessage()

		log.Debug("Client:ReadLoop:for ~ ", string(jsonMsg))

		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Info("unexpected close error: %v", err)
			}
			break
		}

		broadCast <- jsonMsg
	}
}

func (c *Client) WriteLoop() {
	log.Debug("Client:WriteLoop ~ start")

	defer func() {
		c.ws.Close()
	}()

	for {
		message := <-c.sendCh

		log.Debug("Client:WriteLoop:for:message ~ ", string(message))

		w, err := c.ws.NextWriter(websocket.TextMessage)
		if err != nil {
			log.Debug("Client:WriteLoop:for:err ~ ", err.Error())
			return
		}
		w.Write(message)

		log.Debug("Client:WriteLoop:for:len(c.sendCh) ~ ", len(c.sendCh))
		for i := 0; i < len(c.sendCh); i++ {
			w.Write(<-c.sendCh)
		}

		if err := w.Close(); err != nil {
			return
		}
	}
}

func (c *Client) disconnect(unregister chan<- *Client) {
	log.Debug("Client:disconnect: ~ start")
	unregister <- c
	c.ws.Close()
}
