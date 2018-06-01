package server

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-contrib/sessions/memstore"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	middleware "github.com/sairoutine/RenmeriMaker/server/middleware"
)

func (s *Server) SetupMiddleware() {
	r := s.Engine

	var store sessions.Store
	if gin.Mode() == gin.DebugMode {
		// 開発環境の場合、cookie にsession データを保存する
		store = cookie.NewStore([]byte("secret"))
	} else {
		// 本番環境の場合、cookie には session_id しか保存しない
		store = memstore.NewStore([]byte("secret"))
	}

	// セッション
	r.Use(sessions.Sessions("renmeri_maker_session", store))

	// stack stace 表示
	r.Use(middleware.Recovery())

	// csrf
	r.Use(middleware.Csrf())

	// データベース接続
	r.Use(middleware.ConnectDB())

	// 静的ファイル
	r.Use(static.Serve("/bgm", static.LocalFile("../public/bgm", true)))
	r.Use(static.Serve("/image", static.LocalFile("../public/image", true)))
	r.Use(static.Serve("/js", static.LocalFile("../public/js", true)))
	r.Use(static.Serve("/sound", static.LocalFile("../public/sound", true)))
}
