// 初始化富文本编辑器
initEditor()
var layer = layui.layer;
// 1. 初始化图片裁剪器
var $image = $('#image')

// 2. 裁剪选项
var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
}

// 3. 初始化裁剪区域
$image.cropper(options)
$(function () {
    getCate();
    // 选择封面
    $('#chooseImg').on('click', function () {
        $('#coverImg').click();
    })
    // 监听 coverImg 的 change 事件，获取用户选择的文件列表
    $('#coverImg').change(function () {
        // 获取到文件的列表数组
        var files = this.files;
        if (files.length == 0) return layer.msg('未选择图片');
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    //发布文章
    var state;
    $('#publish').click(function () {
        state = '已发布';
    })
    $('#draft').click(function () {
        state = '草稿';
    })
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        //  基于 form 表单，快速创建一个 FormData 对象
        var fd = new FormData(this);
        fd.append('state', state);
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 发起 ajax 数据请求
                $.ajax({
                    method: 'POST',
                    url: '/my/article/add',
                    data: fd,
                    // formData格式的数据在jQuery中必须添加以下两个属性，不然会自动处理数据
                    processData: false,  // 不处理数据
                    contentType: false ,  // 不设置内容类型
                    success: function (res) {
                        if (res.status != 0) return console.log(res);;
                        layer.msg('发布文章成功！');
                        // location.href = '/article/art_list.html';
                    }
                })
            })

    })
})

// 获取文章数据
function getCate() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: (res) => {
            if (res.status !== 0) return layer.msg(res.message);
            console.log(res.data);
            //模版引擎
            var htmlStr = template('tpl', res);
            $('select').html(htmlStr);
            layui.form.render('select'); //刷新select选择框渲染
        }
    })
}

