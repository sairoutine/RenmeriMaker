package util

import (
	"strconv"
)

func String2Uint64(str string) uint64 {
	var ui uint64
	ui, _ = strconv.ParseUint(str, 10, 32)

	return ui
}

func Uint64ToString(ui uint64) string {
	var str string
	str = strconv.FormatUint(ui, 10)
	return str
}

func String2Int(str string) int {
	var i int
	i, _ = strconv.Atoi(str)

	return i
}
