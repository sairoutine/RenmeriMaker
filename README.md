# RenmeriMaker

# ruby + rails のセットアップ
```
brew update
brew install rbenv
echo 'eval "$(rbenv init -)"' >> ~/.zshrc
rbenv install 2.3.1
rbenv global 2.3.1
gem install rails -v 5.0.0
```

# プロジェクトの作成
```
rbenv exec rails _5.0.0_ new RenmeriMaker
```
