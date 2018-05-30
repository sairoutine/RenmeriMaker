package user

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/sairoutine/RenmeriMaker/app/model"
	"github.com/sairoutine/RenmeriMaker/app/util"
	"net/http"
)

func Show(c *gin.Context) {
	db := c.MustGet("DB").(*gorm.DB)
	id := c.Param("id")

	// IDが me かつログイン中ならば自分のプロフィールを表示する
	isMe := false
	if id == "me" {
		isMe = true
	}

	if isMe {
		session := sessions.Default(c)
		userId, ok := session.Get("user_id").(uint64)

		if !ok {
			// 未ログイン
			util.RenderNotFound(c)
			return
		}

		// 自分のユーザーID
		// TODO: Uint64ToString method
		id = util.Uint64ToString(userId)
	}

	user := model.User{}
	recordNotFound := db.Where(&model.User{ID: util.String2Uint64(id)}).First(&user).RecordNotFound()

	if recordNotFound {
		util.RenderNotFound(c)
		return
	}

	// ユーザーに紐づくノベルを取得
	novels := []model.Novel{}
	if isMe {
		// 自分のプロフィールの場合、公開／非公開のノベルを表示
		db.Where(map[string]interface{}{"user_id": id}).Find(&novels)
	} else {
		// 他人のプロフィールの場合、公開のノベルのみを表示
		db.Where(map[string]interface{}{"user_id": id, "is_private": false}).Find(&novels)
	}

	c.HTML(http.StatusOK, "user/show.tmpl", gin.H{
		"ID":     user.ID,
		"Name":   user.DispName,
		"novels": novels,
	})

}

func Logout(c *gin.Context) {
	session := sessions.Default(c)
	session.Clear()
	c.Redirect(http.StatusFound, "/")
}
