$(function () {

})
//获取文章列表
var layer = layui.layer;
var q = {
    pagenum: 1,
    pagesize: 2,
    state: '',
    cate_id: ''
}
initTable();
function initTable() {
    $.ajax({
        method: 'GET',
        url: '/my/article/list',
        data: q,
        success: function (res) {
            if (res.status !== 0) return layer.msg('获取文章列表失败');
            // 使用模板引擎渲染页面的数据
            var htmlStr = template('tpl-table', res)
            $('tbody').html(htmlStr)
            console.log(res.data);
        }
    })
}