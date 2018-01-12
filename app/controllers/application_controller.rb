class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
 include ApplicationHelper

  # ログイン済みユーザーかどうか確認
  def logged_in_user
    unless logged_in?
    flash[:danger] = "ログインしてください"
        redirect_to "/" 
    end
  end
end
