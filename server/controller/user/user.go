package user

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/sairoutine/RenmeriMaker/server/constant"
	"github.com/sairoutine/RenmeriMaker/server/model"
	"github.com/sairoutine/RenmeriMaker/server/util"
	"net/http"
)

func Show(c *gin.Context) {
	db := c.MustGet("DB").(*gorm.DB)
	id := c.Param("id")
	pageNum := c.Query("p")

	// ページ数
	if pageNum == "" {
		pageNum = "1"
	}

	p := util.String2Int(pageNum)

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
	// ページング用に最大件数 取得
	count := 0
	if isMe {
		// 自分のプロフィールの場合、公開／非公開のノベルを表示
		db.Preload("User").Where(map[string]interface{}{"user_id": id}).Limit(constant.PAGE_PER_LIMIT).Offset((p - 1) * constant.PAGE_PER_LIMIT).Find(&novels)

		db.Model(&model.Novel{}).Where(map[string]interface{}{"user_id": id}).Count(&count)
	} else {
		// 他人のプロフィールの場合、公開のノベルのみを表示
		db.Preload("User").Where(map[string]interface{}{"user_id": id, "is_private": false}).Limit(constant.PAGE_PER_LIMIT).Offset((p - 1) * constant.PAGE_PER_LIMIT).Find(&novels)

		db.Model(&model.Novel{}).Where(map[string]interface{}{"user_id": id, "is_private": false}).Count(&count)
	}

	// ページングHTML
	retHTML := util.GenereatePagination(p, count, constant.PAGE_PER_LIMIT)

	util.RenderHTML(c, http.StatusOK, "user/show.tmpl", gin.H{
		"ID":         user.ID,
		"Name":       user.DispName,
		"Novels":     novels,
		"Pagination": retHTML,
	})

}
