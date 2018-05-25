package main

import (
	//CONSTANT "github.com/sairoutine/RenmeriMaker/app/constant"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	server "github.com/sairoutine/RenmeriMaker/app/server"
)

func main() {
	s := server.Build()
	s.Run()
}
