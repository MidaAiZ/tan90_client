$(function() {

    //catalog为存放各节视频、pdf信息的数组
    var catalog={};

    //获取参数方法
    function GetQueryString(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }


    //连接服务器获取课程详细内容
    var params = "id="+ GetQueryString("course_id");
    var url = "http://115.159.188.200:8000/get_chapter/"; 
    var videoId = GetQueryString("video_id");
    var lastVd;//上一个视频的id
    var nextVd;//下一个视频的id
    var pdfId = GetQueryString("pdf_id");
    var lastPdf;//上一个pdf的id
    var nextPdf;//下一个pdf的id
    
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
                //console.log(data);

                //动态生成课程内容及目录
                $("#course-name").text(data.course_name);
                $("#course-time").text("课程发布时间：");
                $("#course-intro").text("课程简介:");
                $(".img-responsive").attr('src','http://115.159.188.200:8000'+data.cover);

                var chaps = data.chapters;
                for (var i = 0; i < chaps.length; i++) {
                    $("#chapter").append('<h3>第'+(i+1)+'章 '+chaps[i].name+'</h3>');
                    var $list = $('<ul></ul>');
                    $("#chapter").append($list);
                    var pdf = (data.chapters[i]).pdf;
                    var video = (data.chapters[i]).video;
                    var max = pdf.length + video.length;
                    for (var j = 0; j < max; j++) {
                        if(j < video.length){
                            var $part = $('<a></a>',{class: 'part',
                                    html: '<li>'+(i+1)+'-'+(j+1)+'  '+video[j].name+'</li>'});
                            $part.attr('video-id', video[j].id);
                            $part.attr('chapter-id', chaps[i].id);
                            $list.append($part);
                        }else{
                            var $part = $('<a></a>',{class: 'part',
                                    html: '<li>'+(i+1)+'-'+(j+1)+'  '+pdf[j-video.length].name+'</li>'});
                            $part.attr('pdf-id', pdf[j-video.length].id);
                            $part.attr('chapter-id', chaps[i].id);
                            $list.append($part);
                        }

                    };
                };

                $(".part").on("click", function(event){
                    var $this = $(this);
                    var id = $this.attr("chapter-id");
                    if(typeof($this.attr("video-id"))!="undefined")
                        window.location.href='lesson.html?course_id='+GetQueryString("course_id")+'&chapter_id='+id+'&video_id='+$this.attr("video-id");
                    else if(typeof($this.attr("pdf-id"))!="undefined")
                        window.location.href='lesson.html?course_id='+GetQueryString("course_id")+'&chapter_id='+id+'&pdf_id='+$this.attr("pdf-id");
                });
            },
            //error:function(XMLHttpRequest, textStatus, errorThrown){
            //通常情况下textStatus和errorThrown只有其中一个包含信息
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                window.alert(textStatus);
            }
    });

    
})




