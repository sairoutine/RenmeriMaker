class SessionsController < ApplicationController
  def create
    # request.env['omniauth.auth']に、OmniAuthによってHashのようにユーザーのデータが格納されている。
    user = User.find_or_create_from_auth_hash(request.env['omniauth.auth'])

    session[:user_id] = user.id
    redirect_to "/", notice: 'ログインしました'
  end
end
