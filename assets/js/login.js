$(function () {
  // 登录/注册盒子显示与隐藏
  $('#link_reg').on("click", function () {
    $(".login_box").hide();
    $(".reg_box").show();
  })
  $('#link_login').on("click", function () {
    $(".login_box").show();
    $(".reg_box").hide();
  })
  //通过form.verify函数自定义验证规则
  var form = layui.form;//定义表单数据验证变量
  var layer = layui.layer;//定义提示框变量
  form.verify({
    //自定义密码校验规则
    pwd: [
      /^[\S]{6,12}/,
      "密码不能包含空格，且只能位于6-12位"
    ],
    repwd: function (value) {
      var value1 = $('.reg_box [name="password"]').val();
      if (value != value1) {
        return "两次密码不一致！"
      }
    }
  })
  //注册功能post
  $('#reg_box').on("submit", function (e) {
    e.preventDefault();
    var username = $('#reg_box [name=username]').val();
    var password = $('#reg_box [name=password]').val();
    $.ajax({
      method: 'POST',
      url: "/api/reguser",
      data: { username: username, password: password },
      success: function (res) {
        if (res.status != 0) {
          return layer.msg(res.message)
        }
        layer.msg('注册成功！');
        setTimeout(function () { $('#link_login').click(); }, 600)

      }
    })
  })
  //登录功能post
  $('#login_box').on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: "/api/login",
      data: $("#login_box").serialize(),
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg('账号或密码错误')
        }
        localStorage.setItem("token", res.token);
        location.href='index.html'
      }
    })
  })
})