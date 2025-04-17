FROM golang:1.24-alpine3.21
WORKDIR /app/backend
COPY . .
RUN go mod tidy
RUN go build -o main .
EXPOSE 8081
CMD ["./main"]
