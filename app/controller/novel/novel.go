package novel

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func New(c *gin.Context) {
	c.HTML(http.StatusOK, "novel/new.tmpl", gin.H{
		"isNew": 1, // true
		"id":    0, // nil
	})

}
func Edit(c *gin.Context) {

}

func Show(c *gin.Context) {

}

func Delete(c *gin.Context) {

}
