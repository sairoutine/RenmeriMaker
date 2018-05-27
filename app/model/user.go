package model

import (
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
	TwitterID                int64  `gorm:"unique_index"`
	TwitterAccessToken       string `gorm:"size:255"`
	TwitterAccessSecret      string `gorm:"size:255"`
	LastShowNotificationDate time.Time
	Novels                   []Novel // One-To-Many relationship (has many - use Novel's UserID as foreign key)
}
