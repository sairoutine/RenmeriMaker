package user

import (
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	model "github.com/sairoutine/RenmeriMaker/app/model"
)

func Index(c *gin.Context) {

}
func Show(c *gin.Context) {
	db := c.MustGet("DB").(*gorm.DB)

	record := model.User{}
	db.First(&record)
	c.JSON(200, gin.H{
		"ID":   record.ID,
		"Name": record.DispName,
	})
}
