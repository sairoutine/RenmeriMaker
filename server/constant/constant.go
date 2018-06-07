package constant

const (
	ScriptShowMode = "show"
	ScriptEditMode = "edit"
	ScriptNewMode  = "new"
)

var EmojiList = []map[string]string{
	{
		"key":   "100",
		"value": "100_Emoji.png",
	},
	{
		"key":   "Clap",
		"value": "Clapping_Hands_Emoji.png",
	},
	{
		"key":   "HeartEyes",
		"value": "Heart_Eyes_Emoji.png",
	},
	{
		"key":   "Hug",
		"value": "Hugging_Face_Emoji.png",
	},
	{
		"key":   "Kiss",
		"value": "Kiss_Emoji_with_Closed_Eyes.png",
	},
	{
		"key":   "Cry",
		"value": "Loudly_Crying_Face_Emoji.png",
	},
	{
		"key":   "Pray",
		"value": "Praying_Emoji.png",
	},
	{
		"key":   "Smile",
		"value": "Smiling_Emoji_with_Smiling_Eyes.png",
	},
	{
		"key":   "Halo",
		"value": "Smiling_Face_with_Halo.png",
	},
	{
		"key":   "Heart",
		"value": "Sparkling_Pink_Heart_Emoji.png",
	},
	{
		"key":   "Star",
		"value": "Star_Emoji.png",
	},
	{
		"key":   "Sunglasses",
		"value": "Sunglasses_Emoji.png",
	},
	{
		"key":   "Joy",
		"value": "Tears_of_Joy_Emoji.png",
	},
}

var EmojiMap = map[string]string{}

func init() {
	for i := range EmojiList {
		EmojiMap[EmojiList[i]["key"]] = EmojiList[i]["value"]
	}
}

const (
	DefaultTitle       = "タイトルなし"
	DefaultDescription = "なし"
)

const (
	// 1ページの表示件数
	PAGE_PER_LIMIT = 8
)
