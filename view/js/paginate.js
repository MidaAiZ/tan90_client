/**
 * Created by Sinner on 2017/6/20.
 */
var myPaginate = function(limit, url, callBK, pageTag) {

    var PAGELIMIT = limit;
    var callBK = callBK;
    var pageClass = (pageTag || ".pagination");
    var paginate = $(pageClass);
    var resUrl = "";
    if(url.lastIndexOf("&") != -1) {
        resUrl = url + "limit=" + PAGELIMIT;
    } else {
        resUrl = url + "?limit=" + PAGELIMIT;
    }

    this.init = init;
    this.update = update;
    this.changeUrl = changeUrl;

    function init() {
        paginate.on("click", "a", function () {
            var _this = $(this);
            getLists(_this.data("href"), _this.data("value"));
        })
        getLists(resUrl, 1);
    }

    function update() {
        getLists(resUrl, paginate.find("li.active").find("a").data("value"));
    }

    function changeUrl(url) {
        resUrl = url;
        update();
    }

    function setPage(count, current) {
        paginate = paginate
        paginate.empty();
        if (count == 0) {

        } else {
            var pages = Math.ceil(count / PAGELIMIT);
            var $firstLi = $("<li><a href='javascript: void(0)' data-href='" + resUrl + "&page=1' data-value='1'>&laquo;</a></li>");
            var $lastLi = $("<li><a href='javascript: void(0)' data-href='" + resUrl + "&page=" + pages + "' data-value='" + pages + "'>&raquo;</a><li>");
            paginate.append($firstLi);
            var begin = current;
            if (begin != pages) { // 不是最后一页
                if (begin < 5)  //一开始几页的情况
                    begin = 1;
                else
                    begin -= 4; // 显示向前三页记录
            } else { // 当最后一页的情况
                for (var i = pages; i > pages - 7; i--) {
                    if (i > 0) begin = i;
                    else break;
                }
            }
        }
        for (var i = begin; i <= pages; i++) {
            var li = "<li>" +
                "<a href='javascript: void(0)' data-href='" + resUrl + "&page=" + i + "' data-value='" + i + "'>" + i + "</a>" +
                "</li>"
            var $li = $(li);
            if (i == current) {
                $li.addClass("active");
            }
            paginate.append($li);
            if (i - begin > 7) break; // 最多显示9页
        }
        paginate.append($lastLi);
    }

    function getLists(url, current) {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            //下面2个参数用于解决跨域问题
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            error: function () {
            },
            success: function (res) {
                var count = res.count;
                setPage(count, current);
                callBK(res);
            }
        });
    }
}
