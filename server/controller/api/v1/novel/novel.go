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

func Create(c *gin.Context) {
	db := c.MustGet("DB").(*gorm.DB)

	// POST データ取得
	c.Request.ParseForm()
	script := c.Request.Form["script"][0]
	title := c.Request.Form["title"][0]
	description := c.Request.Form["description"][0]
	var isPrivate bool
	if c.Request.Form["isPrivate"][0] == "1" {
		isPrivate = true
	} else {
		isPrivate = false
	}

	// ログイン情報を取得
	session := sessions.Default(c)
	loginUserId, ok := session.Get("user_id").(uint64)

	// ログインしていなければエラー
	if !ok {
		util.RenderForbidden(c)
		return
	}

	if title == "" {
		title = constant.DefaultTitle
	}

	if description == "" {
		description = constant.DefaultDescription
	}

	novel := model.Novel{
		UserID:      loginUserId,
		Script:      script,
		Title:       title,
		Description: description,
		IsPrivate:   isPrivate,
	}

	// 新規登録
	db.Create(&novel)

	util.RenderJSON(c, http.StatusOK, gin.H{
		"id": novel.ID,
	})
}

func Update(c *gin.Context) {
	db := c.MustGet("DB").(*gorm.DB)
	id := c.Param("id")

	// POST データ取得
	c.Request.ParseForm()
	script := c.Request.Form["script"][0]
	title := c.Request.Form["title"][0]
	description := c.Request.Form["description"][0]
	var isPrivate bool
	if c.Request.Form["isPrivate"][0] == "1" {
		isPrivate = true
	} else {
		isPrivate = false
	}

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
	novel.Description = description
	novel.Title = title
	novel.IsPrivate = isPrivate

	// 新規登録
	db.Save(&novel)

	util.RenderJSON(c, http.StatusOK, gin.H{
		"id": novel.ID,
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

	// list -> map に変換
	emojiTypeToModelMap := map[string]model.Emoji{}
	for i := range novel.Emojis {
		emojiTypeToModelMap[novel.Emojis[i].Type] = novel.Emojis[i]
	}

	// DBに存在しなかった絵文字を追加
	for key, _ := range constant.EmojiMap {
		if _, ok := emojiTypeToModelMap[key]; !ok {
			emojiTypeToModelMap[key] = model.NewEmoji(novel.ID, key)
		}
	}

	emojiInterfaceList := []interface{}{}
	for i := range constant.EmojiList {
		key := constant.EmojiList[i]["key"]

		emojiModel := emojiTypeToModelMap[key]

		emojiInterface := util.StructToMap(&emojiModel)
		emojiInterface["FileName"] = emojiModel.FileName()

		emojiInterfaceList = append(emojiInterfaceList, emojiInterface)
	}

	util.RenderJSON(c, http.StatusOK, gin.H{
		"Id":          novel.ID,
		"Title":       novel.Title,
		"Description": novel.Description,
		"Script":      novel.Script,
		"IsPrivate":   novel.IsPrivate,
		"User": map[string]interface{}{
			"ID":       novel.User.ID,
			"DispName": novel.User.DispName,
		},
		"Emojis":  emojiInterfaceList,
		"IsOwner": isOwner,
	})

}
