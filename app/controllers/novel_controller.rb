class NovelController < ApplicationController
  # CSRF を一旦無効
  protect_from_forgery except: :create

  # ログインしてないといけないメソッド
  before_action :logged_in_user, only: [:create, :new]

  public
    # 新規作成 入力画面
    def new
    end

    # 新規作成 更新
    def create
      novel = Novel.new(novel_params)
      if novel.save
        # 投稿成功
        render json: {status: "ok"}
        return
      else
        # 投稿失敗
        render json: {status: "ng"}
        return
      end
    end

    # 新着一覧表示
    def list
      @novels = Novel.paginate(page: params[:page], per_page: 10)
    end


  private
    def novel_params
      # POST データ例
      # title=1&script=2&introduction=3
      params.permit(:title, :introduction, :script)
    end
end
