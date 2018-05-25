package model

// Novel is.
type Novel struct {
	ID           uint64  `gorm:"AUTO_INCREMENT"`
	UserID       uint64  `gorm:"index"`
	Title        string  `gorm:"size:255"`
	Introduction string  `gorm:"size:255"`
	Script       string  `gorm:"size:255"`
	Emojis       []Emoji // One-To-Many relationship (has many - use Emoji's UserID as foreign key)
}
