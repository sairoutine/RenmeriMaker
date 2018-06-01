package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/sairoutine/RenmeriMaker/server/util"
	csrf "github.com/utrack/gin-csrf"
	"net/http"
)

func Csrf() gin.HandlerFunc {
	return csrf.Middleware(csrf.Options{
		Secret: "secret",
		ErrorFunc: func(c *gin.Context) {
			util.RenderHTML(c, http.StatusBadRequest, "error/400.tmpl", nil)
			c.Abort()
		},
	})
}
