package main

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"time"
)

/*
	User


    CreditCard        CreditCard      // One-To-One relationship (has one - use CreditCard's UserID as foreign key)
    IgnoreMe          int `gorm:"-"`   // Ignore this field
    Languages         []Language `gorm:"many2many:user_languages;"` // Many-To-Many relationship, 'user_languages' is join table

	Email


    Email   string  `gorm:"type:varchar(100);unique_index"` // `type` set sql type, `unique_index` will create unique index for this column
    Subscribed bool

*/

// User is.
type User struct {
	ID                       uint64 `gorm:"AUTO_INCREMENT"`
	DispName                 string `gorm:"size:255"`
	LastShowNotificationDate time.Time
	Novels                   []Novel // One-To-Many relationship (has many - use Novel's UserID as foreign key)
}

// Novel is.
type Novel struct {
	ID           uint64  `gorm:"AUTO_INCREMENT"`
	UserID       uint64  `gorm:"index"`
	Title        string  `gorm:"size:255"`
	Introduction string  `gorm:"size:255"`
	Script       string  `gorm:"size:255"`
	Emojis       []Emoji // One-To-Many relationship (has many - use Emoji's UserID as foreign key)
}

// Emoji is.
// unique: (novel_id, type)
type Emoji struct {
	ID uint64 `gorm:"AUTO_INCREMENT"`
	// multiple unique key
	NovelID uint64 `gorm:"         unique_index:idx_novel_id_type"`
	Type    string `gorm:"size:255;unique_index:idx_novel_id_type"`
	Count   uint
	Script  string `gorm:"size:255"`
}

func main() {
	db, err := gorm.Open("mysql", "root@tcp(localhost:3307)/renmeri_maker?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		panic(err.Error())
	}

	defer db.Close()

	db = db.Set("gorm:table_options", "ENGINE=InnoDB")

	db.AutoMigrate(
		&User{},
		&Novel{},
		&Emoji{})
}
