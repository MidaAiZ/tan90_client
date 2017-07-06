$(function() {
    //连接服务器
    var params = "";
    var url = "http://115.159.188.200:8000/get_category/"; 
    
    $.ajax({  
            type: 'POST',  
            url: url,  
            dataType: 'text',  
            data: params,  
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,

            complete: function(XMLHttpRequest, textStatus) { 
            },  
            success: function(data) {  
                    
            },
            //error:function(XMLHttpRequest, textStatus, errorThrown){
            //通常情况下textStatus和errorThrown只有其中一个包含信息
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                window.alert(textStatus);
            }
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

    //动态显示所有的课程

    for (var i = 0; i < 10; i++) {
        $($(".sed-md")[i]).css("display", "inline");
        $($(".class-name")[i]).text("课程名称");
        $($(".class-intro")[i]).text("课程简介");
        $($(".img-responsive")[i]).attr("src","images/re1.jpg");;
    };
    
    
})

