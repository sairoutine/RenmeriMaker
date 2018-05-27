package util

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func RenderNotFound(c *gin.Context) {
	c.HTML(http.StatusOK, "error/404.html", nil)
}
