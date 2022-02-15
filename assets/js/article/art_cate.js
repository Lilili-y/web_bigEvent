$(function () {
    getCate();
    //添加功能
    var indexAdd;
    $('#btnAddCate').on('click', function () {
        //打开一个弹出层
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            content: $('#dialog-add').html(),//利用模版引擎思想
            area: ['500px', '300px']
        })
    })
    //动态生成的元素，不能直接添加事件，通过事件委托方式添加提交事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: (res) => {
                if (res.status != 0) return layer.msg(res.message);
                layer.msg('添加文章分类成功')
                getCate();
                layer.close(indexAdd);
            }
        })
    })
    //删除功能
    $('tbody').on('click', '.btn-del', function () {
        var Id = $(this).parent().attr('attr-id');
        layer.confirm('确定删除吗？', { icon: 3, title: '提示' }, function () {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/'+Id,
                success: function (res) {
                    if (res.status != 0) return layer.msg('删除文章分类成功');
                    layer.msg(res.message);
                    getCate();
    }
            })
        })
        
    })
    //编辑功能
    var indexEdit;
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            title: '编辑文章分类',
            content: $('#dialog-edit').html(),//利用模版引擎思想
            area: ['500px', '300px']
        })
        var Id = $(this).parent().attr('attr-id');
        $.ajax({
            method:'GET',
            url: '/my/article/cates/' + Id,
            success: function (res) {
                if (res.status != 0) return layer.msg(res.message);
                layui.form.val('form-edit', res.data);//自动填充表单数据
            }
        })
    })
    //保存修改的结果
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data:$(this).serialize(),
            success: function (res) {
                if (res.status != 0) return layer.msg(res.message);
                layer.close(indexEdit);
                getCate();
            }
        })
    })
})
var layer = layui.layer;
// 获取文章数据并渲染到表格
function getCate() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: (res) => {
            if (res.status !== 0) return layer.msg(res.message);
            //模版引擎
            var htmlStr = template('tpl', res);
            $('tbody').html(htmlStr)
        }
    })
}