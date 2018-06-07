package util

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	csrf "github.com/utrack/gin-csrf"
	"net/http"
)

// 200 OK HTML
func RenderHTML(c *gin.Context, code int, name string, obj gin.H) {
	if obj == nil {
		obj = gin.H{}
	}

	//is login
	session := sessions.Default(c)
	_, ok := session.Get("user_id").(uint64)

	if ok {
		obj["_isLogin"] = true
	}

	// csrf token
	obj["_csrf"] = csrf.GetToken(c)

	c.HTML(code, name, obj)
}

// 200 OK JSON
func RenderJSON(c *gin.Context, code int, obj gin.H) {
	if gin.Mode() == gin.DebugMode {
		c.IndentedJSON(code, obj)
	} else {
		c.JSON(code, obj)
	}
}

// 404 エラー
func RenderNotFound(c *gin.Context) {
	c.HTML(http.StatusNotFound, "error/404.tmpl", nil)
}

// 403 エラー
func RenderForbidden(c *gin.Context) {
	c.HTML(http.StatusForbidden, "error/403.tmpl", nil)
}
