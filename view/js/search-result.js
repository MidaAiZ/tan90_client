$(function() {
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

