class ChangeUserIdColumn < ActiveRecord::Migration[5.0]
  def up
    change_column :users, :id, :bigint, auto_increment: true
  end

  def down
    change_column :users, :id, :integer, auto_increment: true
  end
end
