package server

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

type Server struct {
	Engine *gin.Engine
}

func New() *Server {
	r := gin.Default()
	return &Server{Engine: r}
}

func (s *Server) Run(addr ...string) {
	s.Engine.Run(addr...)
}

func (s *Server) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	s.Engine.ServeHTTP(w, req)
}

func Build() *Server {
	s := New()
	s.SetupMiddleware()
	s.SetupTemplate()
	s.SetupTwitterOAuth()
	s.SetupRouter()

	return s
}
