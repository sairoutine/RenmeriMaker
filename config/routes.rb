Rails.application.routes.draw do
  #resources :novel, only: [:create]
  post '/novel/create', to: 'novel#create'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
