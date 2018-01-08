class NovelController < ApplicationController
  # CSRF を一旦無効
  protect_from_forgery except: :create

  public
    def create
      novel = Novel.new(novel_params)
      if novel.save
        # 投稿成功
        render json: {status: "ok"}
        return
      else
        # 投稿失敗
        render json: {status: "ng"}
      end
    end
  private
    def novel_params
      # POST データ例
      # title=1&script=2&introduction=3
      params.permit(:title, :introduction, :script)
    end
end
