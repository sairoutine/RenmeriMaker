package main

import (
	//CONSTANT "github.com/sairoutine/RenmeriMaker/app/constant"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

func main() {
	// データベース
	db, err := gorm.Open("mysql", "root@tcp(localhost:3306)/renmeri_maker")
	defer db.Close()
	if err != nil {
		panic(err.Error())
	}

	r := gin.Default()
	r.Static("/", "../public")
	/*
		r.GET("/ping", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "pong",
			})
		})
	*/
	r.Run() // listen and serve on 0.0.0.0:8080
}
