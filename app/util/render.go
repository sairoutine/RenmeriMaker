package util

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func RenderNotFound(c *gin.Context) {
	c.HTML(http.StatusNotFound, "error/404.tmpl", nil)
}
