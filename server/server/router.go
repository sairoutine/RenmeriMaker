package server

import (
	controllerRoot "github.com/sairoutine/RenmeriMaker/server/controller"
	controllerApiV1Novel "github.com/sairoutine/RenmeriMaker/server/controller/api/v1/novel"
	controllerApiV1NovelEmoji "github.com/sairoutine/RenmeriMaker/server/controller/api/v1/novel/emoji"
	controllerNovel "github.com/sairoutine/RenmeriMaker/server/controller/novel"
	controllerUser "github.com/sairoutine/RenmeriMaker/server/controller/user"
	"github.com/sairoutine/RenmeriMaker/server/util"
)

func (s *Server) SetupRouter() {
	r := s.Engine

	// トップページ
	r.GET("/", controllerRoot.Index)

	// アバウト
	r.GET("/about", controllerRoot.About)

	// ログアウト
	r.GET("/logout", controllerRoot.Logout)

	// ユーザー
	user := r.Group("/user")
	{
		// ユーザーを表示
		user.GET("/show/:id", controllerUser.Show)
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
			// ノベル表示
			apiV1Novel.GET("/show/:id", controllerApiV1Novel.Show)
			// 絵文字
			emoji := apiV1Novel.Group("/emoji/:id")
			{
				// 絵文字を投稿
				emoji.POST("/add/:type", controllerApiV1NovelEmoji.Add)
			}

		}
	}

	r.NoRoute(util.RenderNotFound)
}
