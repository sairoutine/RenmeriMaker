package novel

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/sairoutine/RenmeriMaker/app/constant"
	"github.com/sairoutine/RenmeriMaker/app/model"
	"github.com/sairoutine/RenmeriMaker/app/util"
	"net/http"
)

func New(c *gin.Context) {
	c.HTML(http.StatusOK, "novel/new.tmpl", gin.H{
		"Script": "", // nil
		"Mode":   constant.ScriptNewMode,
		"Id":     0, // nil

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

	c.HTML(http.StatusOK, "novel/edit.tmpl", gin.H{
		"Script": novel.Script,
		"Mode":   constant.ScriptEditMode,
		"Id":     novel.ID,
	})
}

func Show(c *gin.Context) {
	db := c.MustGet("DB").(*gorm.DB)
	id := c.Param("id")

	novel := model.Novel{}
	recordNotFound := db.Where(&model.Novel{ID: util.String2Uint64(id)}).First(&novel).RecordNotFound()

	// 存在しないノベルならエラー
	if recordNotFound {
		util.RenderNotFound(c)
		return
	}

	c.HTML(http.StatusOK, "novel/show.tmpl", gin.H{
		//"UserName": "test",
		//"Title": "test",
		//"Introduction": "test",
		"Script": novel.Script,
		"Mode":   constant.ScriptShowMode,
		"Id":     novel.ID,
	})

}

func Delete(c *gin.Context) {

}
