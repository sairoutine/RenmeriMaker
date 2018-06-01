package util

import (
	"fmt"
	"github.com/gigovich/simpagin"
	"html/template"
)

var N = 5

// ページング
func GenereatePagination(p int, count int, limit int) template.HTML {
	pg := simpagin.New(
		p,     // Active page which items we displaying now
		count, // Total count of items
		limit, // We show only LIMIT items in each page
		N,     // And our paginator rendered as N pages list
	)

	pg.SetRenderer(func(p simpagin.Page) string {
		switch p.Type {
		case simpagin.PageLeft:
			if p.Number == 0 {
				return `<li class="disabled"><span>&laquo;</span></li>`
			}
			return fmt.Sprintf(`<li><a href="?p=%d">&laquo;</a></li>`, p.Number)
		case simpagin.PageMiddle:
			if p.IsActive {
				return fmt.Sprintf(`<li class="active"><span>%d</span></li>`, p.Number)
			}
			return fmt.Sprintf(`<li><a href="?p=%d">%d</a></li>`, p.Number, p.Number)
		case simpagin.PageRight:
			if p.Number == 0 {
				return `<li class="disabled"><span>&raquo;</span></li>`
			}
			return fmt.Sprintf(`<li><a href="?p=%d">&raquo;</a></li>`, p.Number)
		}
		return ""
	})

	retStr := pg.LeftPage.String()
	for _, page := range pg.PageList {
		retStr += page.String()
	}

	retStr += pg.RightPage.String()
	retHTML := template.HTML(retStr)

	return retHTML
}
