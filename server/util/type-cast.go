package util

import (
	"reflect"
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

func StructArrayToMapArray(data interface{}) []map[string]interface{} {
	rv := reflect.ValueOf(data)
	maps := make([]map[string]interface{}, 0, rv.Len())

	for i := 0; i < rv.Len(); i++ {
		st := rv.Index(i)
		rt := st.Type()

		// マップに代入
		m := make(map[string]interface{})
		for i := 0; i < rt.NumField(); i++ {
			m[rt.Field(i).Name] = st.Field(i).Interface()
		}

		maps = append(maps, m)
	}
	return maps
}
