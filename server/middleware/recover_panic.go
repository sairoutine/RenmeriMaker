package middleware

import (
	"fmt"
	"github.com/ekyoung/gin-nice-recovery"
	"github.com/gin-gonic/gin"
	"github.com/go-errors/errors"
	"github.com/sairoutine/RenmeriMaker/server/util"
	"net/http"
)

func Recovery() gin.HandlerFunc {
	return nice.Recovery(recoveryHandler)
}

func recoveryHandler(c *gin.Context, err interface{}) {
	goErr := errors.Wrap(err, 4)

	var isDebug bool
	if gin.Mode() == gin.DebugMode {
		isDebug = true
	} else {
		isDebug = false
	}

	util.RenderHTML(c, http.StatusInternalServerError, "error/500.tmpl", gin.H{
		"message":    goErr.Error(),
		"stacktrace": fmt.Sprintf("%s", goErr.Stack()),
		"isDebug":    isDebug,
	})
}
