Rails.application.routes.draw do
  root   'novel#list'

  get '/auth/:provider/callback' => 'sessions#create'
  get '/logout' => 'sessions#destroy'

  #resources :novel, only: [:create]
  post '/novel/create', to: 'novel#create'
  get  '/novel/new',    to: 'novel#new'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
