package main

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	model "github.com/sairoutine/RenmeriMaker/server/model"
)

func main() {
	db, err := gorm.Open("mysql", "root@tcp(localhost:3307)/renmeri_maker?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		panic(err.Error())
	}

	defer db.Close()

	db = db.Set("gorm:table_options", "ENGINE=InnoDB")

	db.AutoMigrate(
		&model.User{},
		&model.Novel{},
		&model.Emoji{})
}
