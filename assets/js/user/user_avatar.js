$(function () {
    var layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)
    $('#btnUp').on('click', function () {
        $('#btnChooseImage').click();
    })
    $('#btnChooseImage').on('change', function () {
        // 拿到选择的文件
        var files = this.files;
        if (files.length == 0) {
            return layer.msg("未选择文件")
        }
        //将文件转换为路径
        var imgURL = URL.createObjectURL(files[0]);
        // 3. 重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    $('#btnUpload').on('click', e => {
        var dataURL = $image
        .cropper('getCroppedCanvas', {
          // 创建一个 Canvas 画布
          width: 100,
          height: 100
        })
            .toDataURL('image/png')
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar:dataURL
            },
            success: (res) => {
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg('更换头像成功！');
                window.parent.getUserInfo();//子文件调用父文件的方法window.parent
            }
        })
    })
})
