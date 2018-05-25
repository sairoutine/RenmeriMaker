package main

import (
	//CONSTANT "github.com/sairoutine/RenmeriMaker/app/constant"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	controllerNovel "github.com/sairoutine/RenmeriMaker/app/controller/novel"
	controllerNovelEmoji "github.com/sairoutine/RenmeriMaker/app/controller/novel/emoji"
	controllerUser "github.com/sairoutine/RenmeriMaker/app/controller/user"
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
		user.GET("/", controllerUser.Index)
		// ユーザーを表示
		user.GET("/show/:id", controllerUser.Show)
	}
	// ノベル
	novel := r.Group("/novel")
	{
		// ノベル投稿 表示ページ
		novel.GET("/new", controllerNovel.New)
		// ノベル投稿
		novel.POST("/create", controllerNovel.Create)
		// ノベル投稿 編集ページ
		novel.GET("/edit", controllerNovel.Edit)
		// ノベル表示
		novel.GET("/show/:id", controllerNovel.Show)
		// ノベル更新
		novel.POST("/update/:id", controllerNovel.Update)
		// ノベル削除
		novel.DELETE("/delete/:id", controllerNovel.Delete)
		// 絵文字
		emoji := novel.Group("/emoji/:id")
		{
			// 絵文字を投稿
			emoji.POST("/create", controllerNovelEmoji.Create)
		}
	}

	r.Run()
}
