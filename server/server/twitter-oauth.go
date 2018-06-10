package server

import (
	"flag"
	"github.com/coreos/pkg/flagutil"
	"github.com/dghubble/go-twitter/twitter"
	"github.com/dghubble/oauth1"
	oauth1Twitter "github.com/dghubble/oauth1/twitter"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/sairoutine/RenmeriMaker/server/model"
	"github.com/sairoutine/RenmeriMaker/server/settings"
	"github.com/sairoutine/RenmeriMaker/server/util"
	"net/http"
	"os"
	"time"
)

func (s *Server) SetupTwitterOAuth() {
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

	// callback url
	setting := settings.LoadSetting()
	host := setting.Application.Host

	config := oauth1.Config{
		ConsumerKey:    *consumerKey,
		ConsumerSecret: *consumerSecret,
		Endpoint:       oauth1Twitter.AuthorizeEndpoint,
		CallbackURL:    "http://" + host + "/twitter/callback",
	}

	// requestTokenを取得して Twitter OAuth認証ページにリダイレクト
	r.GET("/twitter/auth", func(c *gin.Context) {
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
	r.GET("/twitter/callback", func(c *gin.Context) {
		db := c.MustGet("DB").(*gorm.DB)

		oauthToken := c.Query("oauth_token")
		oauthVerifier := c.Query("oauth_verifier")

		session := sessions.Default(c)
		requestSecret, ok := session.Get("request_secret").(string)

		if !ok {
			util.RenderForbidden(c)
			return
		}

		accessToken, accessSecret, _ := config.AccessToken(oauthToken, requestSecret, oauthVerifier)

		// Twitter 情報の取得
		config := oauth1.NewConfig(*consumerKey, *consumerSecret)
		token := oauth1.NewToken(accessToken, accessSecret)
		httpClient := config.Client(oauth1.NoContext, token)
		client := twitter.NewClient(httpClient)

		f := false
		t := true
		twitterUser, _, _ := client.Accounts.VerifyCredentials(&twitter.AccountVerifyParams{
			IncludeEntities: &f,
			IncludeEmail:    &t,
		})

		// すでにユーザー登録されていないか確認
		user := model.User{}
		recordNotFound := db.Where(&model.User{TwitterID: twitterUser.ID}).First(&user).RecordNotFound()

		if recordNotFound {
			// 新規登録
			user = model.User{
				DispName:                 twitterUser.Name,
				TwitterID:                twitterUser.ID,
				TwitterAccessToken:       accessToken,
				TwitterAccessSecret:      accessSecret,
				LastShowNotificationDate: time.Now(),
			}

			db.Create(&user)
		} else {
			// すでに登録されている

			// Twitter アクセストークンだけ更新
			user.TwitterAccessToken = accessToken
			user.TwitterAccessSecret = accessSecret
			db.Save(&user)
		}

		// 認証時に生成したリクエストトークンを削除
		session.Delete("request_secret")

		// user_id をセッションに保存
		session.Set("user_id", user.ID)
		session.Save()

		c.Redirect(http.StatusFound, "/")
	})
}
