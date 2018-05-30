package controller

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/sairoutine/RenmeriMaker/app/model"
	"net/http"
)

func Index(c *gin.Context) {
	db := c.MustGet("DB").(*gorm.DB)

	// ログイン情報を取得
	session := sessions.Default(c)
	_, ok := session.Get("user_id").(uint64)

	isLogin := false
	if ok {
		isLogin = true
	}

	// ノベル一覧
	novels := []model.Novel{}
	db.Where(map[string]interface{}{"is_private": false}).Find(&novels)

	c.HTML(http.StatusOK, "root/index.tmpl", gin.H{
		"novels":  novels,
		"isLogin": isLogin,
	})
}

func About(c *gin.Context) {
	c.HTML(http.StatusOK, "root/about.tmpl", gin.H{})
}

func Logout(c *gin.Context) {
	session := sessions.Default(c)
	session.Clear()
	session.Save()
	c.Redirect(http.StatusFound, "/")
}
