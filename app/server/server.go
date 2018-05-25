package server

import (
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
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
	// データベース
	db, err := gorm.Open("mysql", "root@tcp(localhost:3307)/renmeri_maker")
	defer db.Close()
	if err != nil {
		panic(err.Error())
	}

	s := New()
	s.SetupMiddleware()
	s.SetupRouter()

	return s
}
