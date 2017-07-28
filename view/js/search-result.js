var myPage;

$(function() {
    initCourse();

    //获取参数方法
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }

    //监听所有的课程封面及课程名
    if (GetQueryString('keyword') != null) {
        $(document).attr("title", "搜索结果");
        $('#title').text("搜索结果");
        //连接服务器获取搜索结果
        var params = "limit=20&page=1&msg=" + GetQueryString('keyword');
        console.log(params);
        var url = "http://115.159.188.200:8000/search_course/";
        myPage.changeUrl(url, callbSearch);
    }

    function callbSearch(data) {
        console.log(data);
        if(data.code==1000){
            var course = data.courses;
            for (var i = 0; i < course.length; i++) {
                $($(".sed-md")[i]).css("display", "inline");
                $($(".class-name")[i]).text(course[i].course_name);
                $($(".class-name")[i]).attr("course-id", course[i].course_id);
                $($(".class-pic")[i]).attr("course-id", course[i].course_id);
                $($(".class-intro")[i]).text(course[i].course_introduce);
                $($(".img-responsive")[i]).attr("src", "http://115.159.188.200:8000" + course[i].url);
            };
        }
    }

    //监听所有的课程封面及课程名
    $(".class-pic").on("click", function(event) {
        var $this = $(this);
        var id = $this.attr("course-id");
        window.location.href = 'catalog.html?course_id=' + id ;
    });
    $(".class-name").on("click", function(event) {
        var $this = $(this);
        var id = $this.attr("course-id");
        window.location.href = 'catalog.html?course_id=' + id ;
    });

    $(".filter-category-text").on("click", function(event) {
        var $this = $(this);
        console.log($this);
        $this.addClass("active").siblings().removeClass("active");
        event.stopPropagation();
    });

    $(".filter-rank-text").on("click", function(event) {
        var $this = $(this);
        console.log($this);
        $this.addClass("active").siblings().removeClass("active");
        event.stopPropagation();
    });

    $(".sed-md").css("display", "none");

})

function initCourse() {

    //连接服务器获取课程列表
    var limit = 16;
    var url = "http://115.159.188.200:8000/get_courses/";
    myPage = new myPaginate(limit, url, callb);
    myPage.init();

    function callb(data) {
        console.log(data);
        var courses = data.courses;
        for (var i = 0; i < courses.length; i++) {
            $($(".sed-md")[i]).css("display", "inline");
            $($(".class-name")[i]).text(courses[i].name);
            $($(".class-name")[i]).attr("course-id", courses[i].id);
            $($(".class-pic")[i]).attr("course-id", courses[i].id);
            $($(".class-intro")[i]).text(courses[i].introduce);
            $($(".img-responsive")[i]).attr("src", "http://115.159.188.200:8000" + courses[i].cover);
        };
    }
}
