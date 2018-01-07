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
