package util

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

// 404 エラー
func RenderNotFound(c *gin.Context) {
	c.HTML(http.StatusNotFound, "error/404.tmpl", nil)
}

// 403 エラー
func RenderForbidden(c *gin.Context) {
	c.HTML(http.StatusForbidden, "error/403.tmpl", nil)
}
