$(function () {
    getUserInfo();
    var layer = layui.layer;
    $('#logout').on('click', function () {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 1. 清空本地存储中的 token
            localStorage.removeItem('token')
            // 2. 重新跳转到登录页面
            location.href = '/login.html'
      
            // 关闭 confirm 询问框
            layer.close(index)
          })
    })
})
// ajax请求，获取用户信息
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        success: function (res) {
            if (res.status !== 0) {
                return console.log("身份认证失败！");
            }
            renderAvatar(res.data)
        }
    })
}
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $('#welcome').html("欢迎&nbsp;&nbsp;" + name).show();
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        $('.layui-nav-img')
          .attr('src', user.user_pic)
          .show()
        $('.text-avatar').hide()
      } else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar')
          .html(first)
          .show()
      }
}