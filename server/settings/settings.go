package settings

import (
	"io/ioutil"
	"strconv"

	"github.com/gin-gonic/gin"
	"gopkg.in/yaml.v2"
)

type Settings map[string]Setting

type Setting struct {
	MySQL       MySQLSetting
	Application ApplicationSetting
}

type MySQLSetting struct {
	Protocol string
	Host     string
	Port     int
	User     string
	Database string
}

type ApplicationSetting struct {
	Host string
}

const MySQLOption = "?charset=utf8&parseTime=True&loc=Local"

var settings Settings = nil

func LoadSetting() Setting {
	if settings == nil {
		buf, err := ioutil.ReadFile("./config/database.yml")
		if err != nil {
			panic(err)
		}

		settings = Settings{}
		err = yaml.Unmarshal(buf, &settings)
		if err != nil {
			panic(err.Error())
		}
	}

	return settings[gin.Mode()]
}

// ex) "root@tcp(mysql:3306)/renmeri_maker"
func (s Setting) MySQLConnection() string {
	ret := s.MySQL.User + "@" + s.MySQL.Protocol + "(" + s.MySQL.Host + ":" + strconv.Itoa(s.MySQL.Port) + ")/" + s.MySQL.Database + MySQLOption
	return ret
}

func (s Setting) MySQLConnectionWithoutDatabase() string {
	ret := s.MySQL.User + "@" + s.MySQL.Protocol + "(" + s.MySQL.Host + ":" + strconv.Itoa(s.MySQL.Port) + ")/" + MySQLOption
	return ret
}
