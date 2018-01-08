class TableNameAutoincrement < ActiveRecord::Migration[5.0]
  def change
    execute "ALTER TABLE novels MODIFY COLUMN id bigint AUTO_INCREMENT;"
  end
end
