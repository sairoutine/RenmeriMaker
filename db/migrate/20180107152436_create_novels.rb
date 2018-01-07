class CreateNovels < ActiveRecord::Migration[5.0]
  def change
    create_table :novels do |t|
      t.string :title
      t.text :introduction
      t.text :script

      t.timestamps
    end
    change_column :novels, :id, :bigint
  end
end
