package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

func ConnectDB() gin.HandlerFunc {
	return func(c *gin.Context) {
		db, err := gorm.Open("mysql", "root@tcp(localhost:3307)/renmeri_maker")
		defer db.Close()
		if err != nil {
			panic(err.Error())
		}

		if err != nil {
			panic(err.Error())
		}
		defer db.Close()

		c.Set("DB", db)
		c.Next()
	}
}
