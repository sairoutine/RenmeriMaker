package user

import (
	"fmt"
	"github.com/gigovich/simpagin"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/sairoutine/RenmeriMaker/app/model"
	"github.com/sairoutine/RenmeriMaker/app/util"
	"html/template"
	"net/http"
)

const LIMIT = 10

func Show(c *gin.Context) {
	db := c.MustGet("DB").(*gorm.DB)
	id := c.Param("id")
	page_num := c.Query("p")

	// ページ数
	if page_num == "" {
		page_num = "1"
	}

	p := util.String2Int(page_num)

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

	// ページング用に最大件数 取得
	count := 0
	if isMe {
		// 自分のプロフィールの場合、公開／非公開のノベルを表示
		db.Model(&model.Novel{}).Where(map[string]interface{}{"user_id": id}).Count(&count)
	} else {
		// 他人のプロフィールの場合、公開のノベルのみを表示
		db.Model(&model.Novel{}).Where(map[string]interface{}{"user_id": id, "is_private": false}).Count(&count)
	}

	// ページング設定
	pg := simpagin.New(
		p,     // Active page which items we displaying now
		count, // Total count of items
		LIMIT, // We show only LIMIT items in each page
		5,     // And our paginator rendered as N pages list
	)

	pg.SetRenderer(func(p simpagin.Page) string {
		switch p.Type {
		case simpagin.PageLeft:
			if p.Number == 0 {
				return `<li class="disabled"><span>&laquo;</span></li>`
			}
			return fmt.Sprintf(`<li><a href="?p=%d">&laquo;</a></li>`, p.Number)
		case simpagin.PageMiddle:
			if p.IsActive {
				return fmt.Sprintf(`<li class="active"><span>%d</span></li>`, p.Number)
			}
			return fmt.Sprintf(`<li><a href="?p=%d">%d</a></li>`, p.Number, p.Number)
		case simpagin.PageRight:
			if p.Number == 0 {
				return `<li class="disabled"><span>&raquo;</span></li>`
			}
			return fmt.Sprintf(`<li><a href="?p=%d">&raquo;</a></li>`, p.Number)
		}
		return ""
	})

	retStr := pg.LeftPage.String()
	for _, page := range pg.PageList {
		retStr += page.String()
	}

	retStr += pg.RightPage.String()
	retHTML := template.HTML(retStr)

	// ユーザーに紐づくノベルを取得
	novels := []model.Novel{}
	if isMe {
		// 自分のプロフィールの場合、公開／非公開のノベルを表示
		db.Where(map[string]interface{}{"user_id": id}).Limit(LIMIT).Offset(p * LIMIT).Find(&novels)
	} else {
		// 他人のプロフィールの場合、公開のノベルのみを表示
		db.Where(map[string]interface{}{"user_id": id, "is_private": false}).Limit(LIMIT).Offset(p * LIMIT).Find(&novels)
	}

	c.HTML(http.StatusOK, "user/show.tmpl", gin.H{
		"ID":         user.ID,
		"Name":       user.DispName,
		"Novels":     novels,
		"Pagination": retHTML,
	})

}
