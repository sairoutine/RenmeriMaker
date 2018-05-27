package util

import (
	"strconv"
)

func String2Uint64(str string) uint64 {
	var ui uint64
	ui, _ = strconv.ParseUint(str, 10, 32)

	return ui
}
