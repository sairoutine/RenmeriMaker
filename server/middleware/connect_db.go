package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/sairoutine/RenmeriMaker/server/settings"
)

func ConnectDB() gin.HandlerFunc {
	setting := settings.LoadSetting()
	dsn := setting.MySQLConnection()

	return func(c *gin.Context) {
		db, err := gorm.Open("mysql", dsn)
		if err != nil {
			panic(err.Error())
		}
		defer db.Close()

		// ログ設定
		if gin.Mode() == gin.DebugMode {
			db.LogMode(true)
		}

		c.Set("DB", db)
		c.Next()
	}
}
