$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    //初始化文章列表请求数据
    var q = {
        pagenum: 1,
        pagesize: 2,
        state: '',
        cate_id: ''
    }
    // 时间过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        var y = addZero(dt.getFullYear());
        var m = addZero(dt.getMonth() + 1);
        var d = addZero(dt.getDate());
        var h = addZero(dt.getHours());
        var mm = addZero(dt.getMinutes());
        var se = addZero(dt.getSeconds());
        return `${y}-${m}-${d} ${h}:${mm}:${se}`;
    }
    //补零函数
    function addZero(data) {
        return data > 9 ? data : '0' + data;
    }

    // 初始化页面
    initTable();
    initCate();

    // 请求文章列表数据
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
                renderPage(res.total)
            }
        })
    }
    //请求文章分类数据
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取文章分类列表失败');
                var htmlStr = template('tpl_cate', res);
                //调用模版引擎渲染分类的可选结构
                $('[name="cate_id"]').html(htmlStr);
                //通过layui重新渲染表单区域的UI结构
                form.render();
            }
        })
    }
    //为筛选表单绑定submit事件
    $('#form_cate').submit(function (e) {
        e.preventDefault();
        //获取表单选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为查询参数q的对应属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据筛选条件，重新渲染表格数据
        initTable();
    })
    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pagebox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function (obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit
                // 根据最新的 q 获取对应的数据列表，并渲染表格
                if (!first) {
                    initTable()
                }
            }
        });

    }
    //通过事件代理为删除按钮添加点击事件
    $('tbody').on('click', '.btn-del', function () {
        //获取页面上删除按钮的个数
        var len = $('.btn-del').length;
        //获取到文章的id
        var id = $(this).attr('data-id');
        //弹出询问按钮
        layer.confirm('确认删除吗？', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status != 0) return layer.msg('删除文章失败');
                    layer.msg('删除成功');
                    //判断当前页面是否仍然存在数据，不存在的话页面数-1
                    if (len == 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum-1;
                    }
                    initTable();
                }
            })

        });
    })
})

