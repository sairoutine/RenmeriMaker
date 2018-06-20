package server

import (
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	middleware "github.com/sairoutine/RenmeriMaker/server/middleware"
)

func (s *Server) SetupMiddleware() {
	r := s.Engine

	if gin.Mode() == gin.DebugMode {
		// 開発環境ではブラウザ側のキャッシュを無効にする
		r.Use(func(c *gin.Context) {
			c.Writer.Header().Set("Cache-Control", "no-cache")
			c.Next()
		})
	}

	// セッション
	r.Use(middleware.Session())

	// stack stace 表示
	r.Use(middleware.Recovery())

	// csrf
	r.Use(middleware.Csrf())

	// データベース接続
	r.Use(middleware.ConnectDB())

	// 静的ファイル
	r.Use(static.Serve("/bgm", static.LocalFile("./public/bgm", true)))
	r.Use(static.Serve("/image", static.LocalFile("./public/image", true)))
	r.Use(static.Serve("/js", static.LocalFile("./public/js", true)))
	r.Use(static.Serve("/sound", static.LocalFile("./public/sound", true)))
}
