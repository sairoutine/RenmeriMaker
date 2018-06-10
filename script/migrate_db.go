package main

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	model "github.com/sairoutine/RenmeriMaker/server/model"
)

func main() {
	setting := settings.LoadSetting()
	dsn := setting.MySQLConnectionWithoutDatabase()
	dbName := setting.MySQL.Database

	db, err := gorm.Open("mysql", dsn)
	if err != nil {
		panic(err.Error())
	}

	defer db.Close()

	db.Exec("drop database  IF EXISTS " + dbName + ";")
	db.Exec("create database " + dbName + ";")
	db.Exec("USE " + dbName)

	db = db.Set("gorm:table_options", "ENGINE=InnoDB")

	db.AutoMigrate(
		&model.User{},
		&model.Novel{},
		&model.Emoji{})
}
