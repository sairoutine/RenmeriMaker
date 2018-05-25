package server

import (
	"flag"
	"github.com/coreos/pkg/flagutil"
	"github.com/dghubble/oauth1"
	"github.com/dghubble/oauth1/twitter"

	"github.com/gin-gonic/contrib/sessions"
	"github.com/gin-gonic/gin"
	controllerNovel "github.com/sairoutine/RenmeriMaker/app/controller/novel"
	controllerNovelEmoji "github.com/sairoutine/RenmeriMaker/app/controller/novel/emoji"
	controllerUser "github.com/sairoutine/RenmeriMaker/app/controller/user"
	"net/http"
	"os"
)

func (s *Server) SetupRouter() {
	r := s.Engine

	// 環境変数からconsumer-key, consumer-secretを取得
	flags := flag.NewFlagSet("app-auth", flag.ExitOnError)
	consumerKey := flags.String("consumer-key", "", "Twitter Consumer Key")
	consumerSecret := flags.String("consumer-secret", "", "Twitter Consumer Secret")
	flags.Parse(os.Args[1:])
	flagutil.SetFlagsFromEnv(flags, "TWITTER")

	if *consumerKey == "" || *consumerSecret == "" {
		panic("TWITTER_CONSUMER_KEY and TWITTER_CONSUMER_SECRET environment is require.")
	}

	config := oauth1.Config{
		ConsumerKey:    *consumerKey,
		ConsumerSecret: *consumerSecret,
		Endpoint:       twitter.AuthorizeEndpoint,
	}

	// ユーザー
	user := r.Group("/user")
	{
		// ユーザー一覧を表示
		user.GET("/", controllerUser.Index)
		// ユーザーを表示
		user.GET("/show/:id", controllerUser.Show)

		// requestTokenを取得して Twitter OAuth認証ページにリダイレクト
		user.GET("/new", func(c *gin.Context) {
			// セッション情報を取得
			session := sessions.Default(c)
			accessToken := session.Get("access_token")
			accessSecret := session.Get("access_secret")

			if accessToken == nil || accessSecret == nil {
				requestToken, requestSecret, _ := config.RequestToken()
				session.Set("request_secret", requestSecret)
				session.Save()
				// Twitter OAuth認証ページにリダイレクト
				c.Redirect(http.StatusFound, "https://api.twitter.com/oauth/authenticate?oauth_token="+requestToken)
			} else {
				// すでにツイッター認証済み
				c.Redirect(http.StatusFound, "/")
			}
		})

		// Twitter OAuth認証ページからリダイレクトされる
		// ユーザー登録
		user.GET("/callback", func(c *gin.Context) {
			oauthToken := c.Query("oauth_token")
			oauthVerifier := c.Query("oauth_verifier")

			session := sessions.Default(c)
			requestSecret := session.Get("request_secret").(string)

			accessToken, accessSecret, _ := config.AccessToken(oauthToken, requestSecret, oauthVerifier)

			// TODO:
			// request_secret session の削除
			// Twitter プロフィールの取得
			// 'twitter_id', profile.id をもとにユーザー検索
			// 存在しない insert
			// 存在する access token だけ最新に更新
			// user_id をセッションに登録
			session.Set("access_token", accessToken)
			session.Set("access_secret", accessSecret)
			session.Save()

			c.Redirect(http.StatusFound, "/")
		})

	}
	// ノベル
	novel := r.Group("/novel")
	{
		// ノベル投稿 表示ページ
		novel.GET("/new", controllerNovel.New)
		// ノベル投稿
		novel.POST("/create", controllerNovel.Create)
		// ノベル投稿 編集ページ
		novel.GET("/edit", controllerNovel.Edit)
		// ノベル表示
		novel.GET("/show/:id", controllerNovel.Show)
		// ノベル更新
		novel.POST("/update/:id", controllerNovel.Update)
		// ノベル削除
		novel.DELETE("/delete/:id", controllerNovel.Delete)
		// 絵文字
		emoji := novel.Group("/emoji/:id")
		{
			// 絵文字を投稿
			emoji.POST("/create", controllerNovelEmoji.Create)
		}
	}

}
