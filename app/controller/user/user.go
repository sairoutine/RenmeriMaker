package user

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/sairoutine/RenmeriMaker/app/model"
	"github.com/sairoutine/RenmeriMaker/app/util"
	"net/http"
)

func Index(c *gin.Context) {

}
func Show(c *gin.Context) {
	db := c.MustGet("DB").(*gorm.DB)
	id := c.Param("id")

	// IDが me かつログイン中ならば自分のプロフィールを表示する
	if id == "me" {
		session := sessions.Default(c)
		userId, ok := session.Get("user_id").(string)

		if ok {
			id = userId
		}
	}

	user := model.User{}
	recordNotFound := db.Where(&model.User{ID: util.String2Uint64(id)}).First(&user).RecordNotFound()

	if !recordNotFound {
		c.HTML(http.StatusOK, "user/show.tmpl", gin.H{
			"ID":   user.ID,
			"Name": user.DispName,
		})
	} else {
		util.RenderNotFound(c)
	}
}

func Logout(c *gin.Context) {
	session := sessions.Default(c)
	session.Clear()
	c.Redirect(http.StatusFound, "/")
}
