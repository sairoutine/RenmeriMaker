package main

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	model "github.com/sairoutine/RenmeriMaker/server/model"
)

func main() {
	db, err := gorm.Open("mysql", "root@tcp(localhost:3307)/?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		panic(err.Error())
	}

	defer db.Close()

	db.Exec("drop database  IF EXISTS renmeri_maker;")
	db.Exec("create database renmeri_maker;")
	db.Exec("USE renmeri_maker")

	db = db.Set("gorm:table_options", "ENGINE=InnoDB")

	db.AutoMigrate(
		&model.User{},
		&model.Novel{},
		&model.Emoji{})
}
