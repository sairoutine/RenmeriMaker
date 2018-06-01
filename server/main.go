package main

import (
	_ "github.com/jinzhu/gorm/dialects/mysql"
	server "github.com/sairoutine/RenmeriMaker/server/server"
)

func main() {
	s := server.Build()
	s.Run()
}
