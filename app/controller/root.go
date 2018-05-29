package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/sairoutine/RenmeriMaker/app/model"
	"net/http"
)

func Index(c *gin.Context) {
	db := c.MustGet("DB").(*gorm.DB)

	novels := []model.Novel{}
	db.Where(map[string]interface{}{"is_private": false}).Find(&novels)

	c.HTML(http.StatusOK, "root/index.tmpl", gin.H{
		"novels": novels,
	})
}
