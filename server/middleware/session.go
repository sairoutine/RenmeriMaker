package middleware

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-contrib/sessions/memstore"
	"github.com/gin-gonic/gin"
)

func Session() gin.HandlerFunc {
	var store sessions.Store
	if gin.Mode() == gin.DebugMode {
		// 開発環境の場合、cookie にsession データを保存する
		store = cookie.NewStore([]byte("secret"))
	} else {
		// 本番環境の場合、cookie には session_id しか保存しない
		store = memstore.NewStore([]byte("secret"))
	}

	// セッション
	return sessions.Sessions("renmeri_maker_session", store)
}
