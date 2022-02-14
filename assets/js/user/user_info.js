$(function () {
    var form = layui.form;
    form.verify({
        nickname: [/^[\s\S]{1,6}$/, '昵称必须在1-6位之间']
    })
    // 重置表单的数据
    $('#btnReset').on('click', function (e) {
        // 阻止表单的默认重置行为
        e.preventDefault()
        initUserInfo()
    })
    $(".layui-form").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
            }
        })
    })
})
initUserInfo();
// 初始化用户基本信息
function initUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) return layui.layer.msg('获取用户信息失败');
            layui.form.val("userForm", res.data)
        }
    })
}

