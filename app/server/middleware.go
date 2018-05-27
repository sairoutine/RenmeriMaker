package server

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/memstore"
	"github.com/gin-contrib/static"
	middleware "github.com/sairoutine/RenmeriMaker/app/middleware"
)

func (s *Server) SetupMiddleware() {
	r := s.Engine

	store := memstore.NewStore([]byte("secret"))

	// セッション
	r.Use(sessions.Sessions("renmeri_maker_session", store))

	// データベース接続
	r.Use(middleware.ConnectDB())

	// 静的ファイル
	r.Use(static.Serve("/", static.LocalFile("../public", true)))
}
