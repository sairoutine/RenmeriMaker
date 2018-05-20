# RenmeriMaker

# ruby + rails のセットアップ
```
brew update
brew install rbenv
echo 'eval "$(rbenv init -)"' >> ~/.zshrc
rbenv install 2.3.1
rbenv global 2.3.1
rbenv exec gem install bundler
gem install rails -v 5.0.0
```

# プロジェクトの作成
```
rails _5.0.0_ new RenmeriMaker --database=mysql --skip-bundle
cd Renmerimaker
bundle install
```

# MySQL の接続先
```
mysql.server start
# ※場合によって
vim /config/database.yml
rails db:create
```

# スキーマ定義
```
# まず Novel だけ作成
# カラムのtype 定義↓
# http://api.rubyonrails.org/classes/ActiveRecord/ConnectionAdapters/SchemaStatements.html#method-i-add_column
rails generate model Novel title:string introduction:text script:text
# TODO: id を bigint にする
rails db:migrate
```

```
# ユーザー
rails generate model User provider:string uid:string nickname:string image_url:string last_show_notification_date:datetime
rails generate migration change_user_id_column
```
```
  def up
    change_column :users, :id, :bigint, auto_increment: true
  end

  def down
    change_column :users, :id, :integer, auto_increment: true
  end
```
```
rails db:migrate
```

# OmniAuth
だいたい以下を見ればわかる
https://qiita.com/To_BB/items/01863aa50d628c069b64