package domain

type Message struct {
	Client  *Client
	Message []byte
}

func NewMessage(cln *Client, msg []byte) *Message {
	return &Message{
		Client:  cln,
		Message: msg,
	}
}
