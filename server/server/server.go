package server

import (
	"github.com/gin-contrib/multitemplate"
	"github.com/gin-gonic/gin"
	"html/template"
	"net/http"
	"path/filepath"
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
	s.SetupTwitterOAuth()
	s.SetupRouter()

	// テンプレート
	//s.Engine.LoadHTMLGlob("../template/**/*")

	templatesDir := "../template"
	s.Engine.HTMLRender = loadTemplates(templatesDir, filepath.Join(templatesDir, "include"), filepath.Join(templatesDir, "layout.tmpl"))

	return s
}
func loadTemplates(templatesDir, includeDir, layoutFile string) multitemplate.Renderer {
	r := multitemplate.NewRenderer()

	templateFiles, err := filepath.Glob(templatesDir + "/**/*")
	if err != nil {
		panic(err.Error())
	}

	includes, err := filepath.Glob(filepath.Join(includeDir, "*"))
	if err != nil {
		panic(err.Error())
	}

	for _, temp := range templateFiles {
		files := append([]string{layoutFile, temp}, includes...)
		rel, _ := filepath.Rel(templatesDir, temp)
		r.Add(rel, template.Must(template.ParseFiles(files...)))
	}
	return r
}

//r.AddFromFiles("root/index.tmpl", templatesDir+"/common/layout.tmpl", templatesDir+"/root/index.tmpl")
