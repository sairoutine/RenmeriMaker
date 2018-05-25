package main

import (
	//CONSTANT "github.com/sairoutine/RenmeriMaker/app/constant"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

func main() {
	// データベース
	db, err := gorm.Open("mysql", "root@tcp(localhost:3307)/renmeri_maker")
	defer db.Close()
	if err != nil {
		panic(err.Error())
	}

	r := gin.Default()

	store := sessions.NewCookieStore([]byte("secret"))

	// セッション
	r.Use(sessions.Sessions("renmeri_maker_session", store))
	// 静的ファイル
	r.Use(static.Serve("/", static.LocalFile("../public", true)))

	// ユーザー
	user := r.Group("/user")
	{
		// ユーザー一覧を表示
		user.GET("/", func(c *gin.Context) {

		})
		// ユーザーを表示
		user.GET("/show/:id", func(c *gin.Context) {

		})
	}
	// ノベル
	novel := r.Group("/novel")
	{
		// ノベル投稿 表示ページ
		novel.GET("/new", func(c *gin.Context) {

		})
		// ノベル投稿
		novel.POST("/create", func(c *gin.Context) {

		})
		// ノベル投稿 編集ページ
		novel.GET("/edit", func(c *gin.Context) {

		})

		// ノベル表示
		novel.GET("/show/:id", func(c *gin.Context) {

		})
		// ノベル更新
		novel.POST("/update/:id", func(c *gin.Context) {

		})

		// ノベル削除
		novel.DELETE("/delete/:id", func(c *gin.Context) {

		})

		// 絵文字
		emoji := novel.Group("/emoji/:id")
		{
			// 絵文字を投稿
			emoji.POST("/create", func(c *gin.Context) {

			})
		}
	}

	r.Run()
}
