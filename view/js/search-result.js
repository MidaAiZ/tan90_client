$(function() {

    initCourse();
    //监听所有的课程封面及课程名
    $(".class-pic").on("click", function(event){
        var $this = $(this);
        var id = $this.attr("course-id");
        window.location.href='lesson.html?course_id='+id+'&chapter_index=1&lesson_index=1';
    });
    $(".class-name").on("click", function(event){
        var $this = $(this);
        var id = $this.attr("course-id");
        window.location.href='lesson.html?course_id='+id+'&chapter_index=1&lesson_index=1';
    });

    $(".filter-category-text").on("click", function(event){
        var $this = $(this);
        console.log($this);
        $this.addClass("active").siblings().removeClass("active");
        event.stopPropagation();
    });

    $(".filter-rank-text").on("click", function(event){
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
    var myPage = new myPaginate(limit, url, callb);
    myPage.init();

    function callb(data) {
        console.log(data);
        var courses = data.courses;
        for (var i=0; i<courses.length; i++) {
            $($(".sed-md")[i]).css("display", "inline");
            $($(".class-name")[i]).text(courses[i].name);
            $($(".class-name")[i]).attr("course-id",courses[i].id);
            $($(".class-pic")[i]).attr("course-id",courses[i].id);
            $($(".class-intro")[i]).text(courses[i].introduce);
            $($(".img-responsive")[i]).attr("src","http://115.159.188.200:8000"+courses[i].cover);
        };
    }
}
