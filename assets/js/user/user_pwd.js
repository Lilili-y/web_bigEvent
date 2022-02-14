$(function () {
    var form = layui.form;
    form.verify({
        pwd: [/^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'],
        newpwd: function (value) {
            if ($('[name="oldPwd"]').val() == value) {
                return "新密码不能与原密码相同";
            }
        },
        renewpwd: function (value) {
            if ($('[name="newPwd"]').val() !== value) {
                return "密码不一致!";
            }
        }
    })
    $('#formPwd').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) return layui.layer.msg(res.msg);
                layui.layer.msg('修改密码成功！');
                // 重置表单
                $('#formPwd')[0].reset();
            }
        })
    })
})