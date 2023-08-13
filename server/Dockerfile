FROM golang:1.20-alpine
ENV TZ=Asia/Tokyo

ENV CGO_ENABLED=1
ENV GOOS=linux
ENV GOARCH=arm64
#ENV GOARCH=amd64
ENV ROOTPATH=/go/app

RUN apk update && apk upgrade
RUN apk add --no-cache \
    gcc musl-dev sqlite

WORKDIR ${ROOTPATH}

RUN go install github.com/cosmtrek/air@v1.44.0
# COPY go.mod go.sum .air.toml ./
COPY entrypoint.sh ./
COPY .air.toml ./

COPY src/ ${ROOTPATH}/src/

EXPOSE 80
# CMD ["air", "-c", ".air.toml"]
CMD ["/bin/sh", "entrypoint.sh"]
