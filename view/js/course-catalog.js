$(function() {
    $("#course-name").text("课程名称");
    $("#course-time").text("课程发布时间：");
    $("#course-intro").text("课程简介:");

    for (var i = 0; i < 4; i++) {
        $("#chapter").append('<h3>第'+(i+1)+'章 ***************</h3>');
        $("#chapter").append("<ul>");
        for (var j = 0; j < 10; j++) {
            $("#chapter").append('<li><a href="#">4-'+(j+1)+' ***************</a></li>');
        };
        $("#chapter").append("</ul>");
    };
    
})




