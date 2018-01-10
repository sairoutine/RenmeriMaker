class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  # ログイン済みユーザーかどうか確認
  def logged_in_user
    unless self.helpers.logged_in?
    flash[:danger] = "ログインしてください"
        redirect_to "/" 
    end
  end
end
