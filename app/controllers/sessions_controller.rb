class SessionsController < ApplicationController
  def create
    # request.env['omniauth.auth']に、OmniAuthによってHashのようにユーザーのデータが格納されている。
    user = User.find_or_create_from_auth_hash(request.env['omniauth.auth'])

    session[:user_id] = user.id
    redirect_to "/", notice: 'ログインしました'
  end

  def destroy
    if self.helpers.current_user
      session.delete(:user_id)
      flash[:notice] = "ログアウトしました"
    end
    redirect_to "/"
  end
end
