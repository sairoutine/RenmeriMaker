package server

import (
	"github.com/gin-contrib/multitemplate"
	"path/filepath"
)

func (s *Server) SetupTemplate() {
	r := s.Engine
	templatesDir := "../template"
	r.HTMLRender = loadTemplates(
		templatesDir,
		filepath.Join(templatesDir, "include"),
		filepath.Join(templatesDir, "layout.tmpl"))
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
		r.AddFromFiles(rel, files...)
	}
	return r
}
