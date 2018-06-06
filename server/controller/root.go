package controller

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/sairoutine/RenmeriMaker/server/constant"
	"github.com/sairoutine/RenmeriMaker/server/model"
	"github.com/sairoutine/RenmeriMaker/server/util"
	"net/http"
)

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
	db.Preload("User").Where(map[string]interface{}{"is_private": false}).Limit(constant.PAGE_PER_LIMIT).Offset((p - 1) * constant.PAGE_PER_LIMIT).Find(&novels)

	// ページングHTML
	retHTML := util.GenereatePagination(p, count, constant.PAGE_PER_LIMIT)

	util.RenderHTML(c, http.StatusOK, "root/index.tmpl", gin.H{
		"novels":     novels,
		"isLogin":    isLogin,
		"pagination": retHTML,
	})
}

func About(c *gin.Context) {
	util.RenderHTML(c, http.StatusOK, "root/about.tmpl", gin.H{})
}

func Logout(c *gin.Context) {
	session := sessions.Default(c)
	session.Clear()
	session.Save()
	c.Redirect(http.StatusFound, "/")
}
