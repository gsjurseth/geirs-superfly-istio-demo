FROM golang:1.11-alpine

WORKDIR /go/src/warehouse-client-api
COPY . .

RUN apk add --no-cache git curl
RUN go get -d -v ./...
RUN go install -v ./...
RUN go build

EXPOSE 3333

CMD ["warehouse-client-api"]
