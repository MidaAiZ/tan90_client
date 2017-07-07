$(function() {

    //连接服务器获取课程列表
    var params = "limit=20&page=1";
    var url = "http://115.159.188.200:8000/get_courses/"; 
    
    $.ajax({  
            type: 'POST',  
            url: url,  
            dataType: 'json',  
            data: params,
            //下面2个参数用于解决跨域问题  
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,

            complete: function(XMLHttpRequest, textStatus) { 
            },  
            success: function(data) {  
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
            },
            //error:function(XMLHttpRequest, textStatus, errorThrown){
            //通常情况下textStatus和errorThrown只有其中一个包含信息
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                window.alert(textStatus);
            }
    });
     
    //监听所有的课程封面及课程名 
    $(".class-pic").on("click", function(event){
        var $this = $(this);
        var id = $this.attr("course-id");
        window.location.href='about.html?course_id='+id;
    });
    $(".class-name").on("click", function(event){
        var $this = $(this);
        var id = $this.attr("course-id");
        window.location.href='about.html?course_id='+id;
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

