package novel

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/sairoutine/RenmeriMaker/server/model"
	"github.com/sairoutine/RenmeriMaker/server/util"
	"net/http"
)

func Create(c *gin.Context) {
	db := c.MustGet("DB").(*gorm.DB)

	// POST データ取得
	c.Request.ParseForm()
	script := c.Request.Form["script"][0]

	// ログイン情報を取得
	session := sessions.Default(c)
	loginUserId, ok := session.Get("user_id").(uint64)

	// ログインしていなければエラー
	if !ok {
		util.RenderForbidden(c)
		return
	}

	novel := model.Novel{
		UserID:    loginUserId,
		Script:    script,
		IsPrivate: true,
	}

	// 新規登録
	db.Create(&novel)

	c.JSON(http.StatusOK, gin.H{
		"id": novel.ID,
	})
}

func Update(c *gin.Context) {
	db := c.MustGet("DB").(*gorm.DB)
	id := c.Param("id")

	// POST データ取得
	c.Request.ParseForm()
	script := c.Request.Form["script"][0]

	novel := model.Novel{}
	recordNotFound := db.Where(&model.Novel{ID: util.String2Uint64(id)}).First(&novel).RecordNotFound()

	// 存在しないノベルならエラー
	if recordNotFound {
		util.RenderNotFound(c)
		return
	}

	// ログイン情報を取得
	session := sessions.Default(c)
	loginUserId, ok := session.Get("user_id").(uint64)

	// ログインしていなければエラー
	if !ok {
		util.RenderForbidden(c)
		return
	}

	// 自分が作ったノベルでなければエラー
	if novel.UserID != loginUserId {
		util.RenderForbidden(c)
		return
	}

	novel.Script = script

	// 新規登録
	db.Save(&novel)

	c.JSON(http.StatusOK, gin.H{
		"id": novel.ID,
	})
}
