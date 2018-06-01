package model

// Novel is.
type Novel struct {
	ID          uint64 `gorm:"AUTO_INCREMENT"`
	UserID      uint64 `gorm:"index"`
	User        User
	Title       string  `gorm:"size:255"`
	Description string  `gorm:"size:255"`
	Script      string  `gorm:"type:text"`
	IsPrivate   bool    `gorm:""`
	Emojis      []Emoji // One-To-Many relationship (has many - use Emoji's UserID as foreign key)
}
