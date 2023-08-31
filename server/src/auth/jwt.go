package auth

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// FIXME:
const hmacSecret = "WjdwZUh2dWJGdFB1UWRybg=="
const defaulExpireTime = 604800 // 1 week

type Claims struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	RoomID string `json:"roomId"`
	jwt.RegisteredClaims
}

func (c *Claims) GetId() string {
	return c.ID
}

func (c *Claims) GetName() string {
	return c.Name
}

func (c *Claims) GetRoomID() string {
	return c.RoomID
}

// CreateJWTToken generates a JWT signed token for for the given user
func CreateJWTToken(claims Claims) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"Id":        claims.GetId(),
		"Name":      claims.GetName(),
		"RoomId":    claims.GetRoomID(),
		"ExpiresAt": time.Now().Unix() + defaulExpireTime,
	})
	tokenString, err := token.SignedString([]byte(hmacSecret))

	return tokenString, err
}

func ValidateToken(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return []byte(hmacSecret), nil
	})

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	} else {
		return nil, err
	}
}
