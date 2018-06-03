package novel

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/sairoutine/RenmeriMaker/server/constant"
	"github.com/sairoutine/RenmeriMaker/server/model"
	"github.com/sairoutine/RenmeriMaker/server/util"
	"net/http"
)

func New(c *gin.Context) {
	// ログイン情報を取得
	session := sessions.Default(c)
	_, ok := session.Get("user_id").(uint64)

	// ログインしていなければエラー
	if !ok {
		util.RenderForbidden(c)
		return
	}

	util.RenderHTML(c, http.StatusOK, "novel/new.tmpl", gin.H{
		"Mode":        constant.ScriptNewMode,
		"Id":          0,  // nil
		"Title":       "", // nil
		"Description": "", // nil
		"Script":      "", // nil

	})

}
func Edit(c *gin.Context) {
	db := c.MustGet("DB").(*gorm.DB)
	id := c.Param("id")

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

	// 自分が作ったノベルでなければエラー
	if !ok || novel.UserID != loginUserId {
		util.RenderForbidden(c)
		return
	}

	util.RenderHTML(c, http.StatusOK, "novel/edit.tmpl", gin.H{
		"Mode":        constant.ScriptEditMode,
		"Id":          novel.ID,
		"Title":       novel.Title,
		"Description": novel.Description,
		"Script":      novel.Script,
		"IsPrivate":   novel.IsPrivate,
	})
}

func Show(c *gin.Context) {
	db := c.MustGet("DB").(*gorm.DB)
	id := c.Param("id")

	novel := model.Novel{}
	recordNotFound := db.Preload("User").Preload("Emojis").Where(&model.Novel{ID: util.String2Uint64(id)}).First(&novel).RecordNotFound()

	// 存在しないノベルならエラー
	if recordNotFound {
		util.RenderNotFound(c)
		return
	}

	// ログイン情報を取得
	session := sessions.Default(c)
	loginUserId, ok := session.Get("user_id").(uint64)

	// 自分が作ったノベルかどうか
	isOwner := false
	if ok && novel.UserID == loginUserId {
		isOwner = true
	}

	// 自分が作ったノベルでなく、非公開ならエラー
	if !isOwner && novel.IsPrivate {
		util.RenderNotFound(c)
		return
	}

	util.RenderHTML(c, http.StatusOK, "novel/show.tmpl", gin.H{
		"Novel":       novel,
		"Id":          novel.ID,
		"Title":       novel.Title,
		"Description": novel.Description,
		"Script":      novel.Script,
		"Mode":        constant.ScriptShowMode,
		"IsOwner":     isOwner,
		"EmojiMap":    constant.EmojiMap,
	})

}
