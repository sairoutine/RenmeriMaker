package novel

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/sairoutine/RenmeriMaker/app/model"
	"github.com/sairoutine/RenmeriMaker/app/util"
	"net/http"
)

func Create(c *gin.Context) {
	db := c.MustGet("DB").(*gorm.DB)

	// POST データ取得
	c.Request.ParseForm()
	script := c.Request.Form["script"][0]

	// ログイン情報を取得
	session := sessions.Default(c)
	loginUserId := session.Get("user_id")

	// ログインしていなければエラー
	if loginUserId == nil {
		util.RenderForbidden(c)
		return
	}

	novel := model.Novel{
		UserID: loginUserId.(uint64),
		Script: script,
	}

	// 新規登録
	db.Create(&novel)

	c.JSON(http.StatusOK, gin.H{
		"id": novel.ID,
	})
}

func Update(c *gin.Context) {

}
