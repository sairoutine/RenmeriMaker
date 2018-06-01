package middleware

import (
	"github.com/gin-gonic/gin"
	csrf "github.com/utrack/gin-csrf"
	"net/http"
)

func Csrf() gin.HandlerFunc {
	return csrf.Middleware(csrf.Options{
		Secret: "secret",
		ErrorFunc: func(c *gin.Context) {
			c.HTML(http.StatusBadRequest, "error/400.tmpl", nil)
			c.Abort()
		},
	})
}
