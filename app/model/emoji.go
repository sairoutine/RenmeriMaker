package model

// Emoji is.
type Emoji struct {
	ID uint64 `gorm:"AUTO_INCREMENT"`
	// multiple unique key
	NovelID uint64 `gorm:"         unique_index:idx_novel_id_type"`
	Type    string `gorm:"size:255;unique_index:idx_novel_id_type"`
	Count   uint
	Script  string `gorm:"size:255"`
}
