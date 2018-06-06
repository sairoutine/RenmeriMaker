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
				return `<span class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored" disabled>&laquo;</span>`
			}
			return fmt.Sprintf(`<a class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored" href="?p=%d">&laquo;</a>`, p.Number)
		case simpagin.PageMiddle:
			if p.IsActive {
				return fmt.Sprintf(`<span class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">%d</span>`, p.Number)
			}
			return fmt.Sprintf(`<a class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored" href="?p=%d">%d</a>`, p.Number, p.Number)
		case simpagin.PageRight:
			if p.Number == 0 {
				return `<span class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored" disabled>&raquo;</span>`
			}
			return fmt.Sprintf(`<a class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored" href="?p=%d">&raquo;</a>`, p.Number)
		}
		return ""
	})

	retStr := pg.LeftPage.String() + "&nbsp;"
	for _, page := range pg.PageList {
		retStr += page.String() + "&nbsp;"
	}

	retStr += pg.RightPage.String()
	retHTML := template.HTML(retStr)

	return retHTML
}
