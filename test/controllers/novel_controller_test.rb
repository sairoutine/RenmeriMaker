require 'test_helper'

class NovelControllerTest < ActionDispatch::IntegrationTest
  test "should get edit" do
    get novel_edit_url
    assert_response :success
  end

end
