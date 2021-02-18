FROM alpine:latest

WORKDIR /go/src/warehouse-client-api
COPY . .

RUN apk add --no-cache git make musl-dev go
RUN apk add --no-cache git curl
# Install Glide
RUN go get -u github.com/Masterminds/glide/...
RUN go get -d -v ./...
RUN go install -v ./...
RUN go build

EXPOSE 3333

CMD ["warehouse-client-api"]
