package server

import (
	controllerRoot "github.com/sairoutine/RenmeriMaker/app/controller"
	controllerApiV1Novel "github.com/sairoutine/RenmeriMaker/app/controller/api/v1/novel"
	controllerNovel "github.com/sairoutine/RenmeriMaker/app/controller/novel"
	controllerNovelEmoji "github.com/sairoutine/RenmeriMaker/app/controller/novel/emoji"
	controllerUser "github.com/sairoutine/RenmeriMaker/app/controller/user"
	"github.com/sairoutine/RenmeriMaker/app/util"
)

func (s *Server) SetupRouter() {
	r := s.Engine

	// テンプレート
	r.LoadHTMLGlob("../template/**/*")

	r.GET("/", controllerRoot.Index)

	// ユーザー
	user := r.Group("/user")
	{
		// ユーザー一覧を表示
		user.GET("/", controllerUser.Index)
		// ユーザーを表示
		user.GET("/show/:id", controllerUser.Show)

		// ログアウト
		user.GET("/logout", controllerUser.Logout)
	}
	// ノベル
	novel := r.Group("/novel")
	{
		// ノベル投稿 表示ページ
		novel.GET("/new", controllerNovel.New)
		// ノベル投稿 編集ページ
		novel.GET("/edit/:id", controllerNovel.Edit)
		// ノベル表示
		novel.GET("/show/:id", controllerNovel.Show)
		// ノベル削除
		novel.DELETE("/delete/:id", controllerNovel.Delete)
		// 絵文字
		emoji := novel.Group("/emoji/:id")
		{
			// 絵文字を投稿
			emoji.POST("/create", controllerNovelEmoji.Create)
		}
	}
	// API
	apiV1 := r.Group("/api/v1")
	{
		apiV1Novel := apiV1.Group("/novel")
		{
			// ノベル投稿
			apiV1Novel.POST("/create", controllerApiV1Novel.Create)
			// ノベル更新
			apiV1Novel.POST("/update/:id", controllerApiV1Novel.Update)
		}
	}

	r.NoRoute(util.RenderNotFound)
}
