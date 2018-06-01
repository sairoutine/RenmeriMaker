package controller

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/sairoutine/RenmeriMaker/app/model"
	"github.com/sairoutine/RenmeriMaker/app/util"
	"net/http"
)

// 1ページの表示件数
const LIMIT = 10

func Index(c *gin.Context) {
	db := c.MustGet("DB").(*gorm.DB)
	pageNum := c.Query("p")

	// ページ数
	if pageNum == "" {
		pageNum = "1"
	}

	p := util.String2Int(pageNum)

	// ログイン情報を取得
	session := sessions.Default(c)
	_, ok := session.Get("user_id").(uint64)

	isLogin := false
	if ok {
		isLogin = true
	}

	// ページング用に最大件数 取得
	count := 0
	db.Model(&model.Novel{}).Where(map[string]interface{}{"is_private": false}).Count(&count)

	// ノベル一覧
	novels := []model.Novel{}
	db.Where(map[string]interface{}{"is_private": false}).Limit(LIMIT).Offset((p - 1) * LIMIT).Find(&novels)

	// ページングHTML
	retHTML := util.GenereatePagination(p, count, LIMIT)

	c.HTML(http.StatusOK, "root/index.tmpl", gin.H{
		"novels":     novels,
		"isLogin":    isLogin,
		"pagination": retHTML,
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
