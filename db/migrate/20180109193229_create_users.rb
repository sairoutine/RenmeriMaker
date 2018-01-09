class CreateUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :users do |t|
      t.string :provider
      t.string :uid
      t.string :nickname
      t.string :image_url
      t.datetime :last_show_notification_date

      t.timestamps
    end
  end
end
