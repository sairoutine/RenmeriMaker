package emoji

import (
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/sairoutine/RenmeriMaker/app/constant"
	"github.com/sairoutine/RenmeriMaker/app/model"
	"github.com/sairoutine/RenmeriMaker/app/util"
	"net/http"
)

func Add(c *gin.Context) {
	db := c.MustGet("DB").(*gorm.DB)
	novelId := c.Param("id")
	emojiType := c.Param("type")

	novel := model.Novel{}
	recordNotFound := db.Where(&model.Novel{ID: util.String2Uint64(novelId)}).First(&novel).RecordNotFound()

	// 存在しないノベルならエラー
	if recordNotFound {
		util.RenderNotFound(c)
		return
	}

	// 存在しない絵文字ならエラー
	if _, ok := constant.EmojiMap[emojiType]; !ok {
		util.RenderNotFound(c)
		return
	}

	// +1
	db.Exec(`
		INSERT INTO emojis
			(novel_id,type,count) VALUES (?,?,1)
		ON DUPLICATE KEY UPDATE
			count=count+1
	`, novelId, emojiType)

	c.Redirect(http.StatusMovedPermanently, "/novel/show/"+novelId)
}
