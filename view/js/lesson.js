$(function() {

    //获取参数方法
    function GetQueryString(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }


    //catalog为存放各节视频、pdf信息的数组
    var catalog = new Array();
    var t = 0;//t用于catalog数组计数

    //连接服务器获取课程详细内容
    var params = "id="+ GetQueryString("course_id");
    var url = "http://115.159.188.200:8000/get_chapter/"; 
    
    /**
    下面是课程目录的自动生成
    **/


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

                var chaps = data.chapters;

                //将返回数据存入catalog数组
                for (var i = 0; i < chaps.length; i++) {
                    for (var j = 0; j < (chaps[i]).video.length; j++){
                        //catalog[t] = {"chapter":(i+1),"index":((chaps[i]).video[j]).index, "video-id": ((chaps[i]).video[j]).id};
                        catalog[t] = {"chapter":(i+1),"video-id": ((chaps[i]).video[j]).id};
                        t++;

                    };
                    for (var j = 0; j < (chaps[i]).pdf.length; j++){

                    };
                };

                console.log(catalog);

                //动态生成课程内容及目录
                $("#course-name").text(data.course_name);
                $("#course-time").text("课程发布时间：");
                $("#course-intro").text("课程简介:");
                $(".img-responsive").attr('src','http://115.159.188.200:8000'+data.cover);

                
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

    /**
    下面是课程问答模块的自动生成
    **/ 

    var $answInput;
    var $answCon;

    //连接服务器获取讨论区内容
    var params = "chapter_id="+GetQueryString("chapter_id")+"&limit=20&page_index=1";
    
    $.ajax({  
            type: 'POST',  
            url: "http://115.159.188.200:8000/get_discussion_list/",  
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

                var discList = data.discussion_list;
                
                for (var i = 0; i < discList.length; i++) {

                    var $quesAnsw = $('<div />',{class: 'ques-answer num'+i});
                    var $parentDiv = $('<div />',{class: 'answer-con first'});
                    var $headPic = $('<div />',{class: 'user-pic',
                                    html:'<img src="http://115.159.188.200:8000'+discList[i].questioner_face+'" width="40" height="40" alt="?">'});
                    var $quesUser = $('<div />',{class: 'detail-r',
                                    html:'<span class="time">'+discList[i].question_time+'</span>'+
                                '<a class="detail-name" href="#" target="_blank">'+discList[i].questioner_name+'</a>'+
                                '<p class="detail-signal">'+discList[i].questioner_department+'</p>'})
                    var $quesCon = $('<div />',{class: 'ques-content rich-text aimgPreview',
                                    html:'<p>'+discList[i].question_content+'</p>'});
                    $answCon = $('<div />',{class:'answer-content rich-text aimgPreview ctrl-bar'});
                    $answCon.append('<span"><em>'+discList[i].response_cnt+'</em>个回复：</span>');
                    var max_bound = discList[i].response_page1.length;
                    //console.log(max_bound);
                    var bd = max_bound < 10 ? max_bound : 10;
                    for (var j = 0; j < bd; j++) {
                        var answ = discList[i].response_page1;
                        $answCon.append('<p>'+answ[j].user_name+'：'+answ[j].content+'</p>');
                    };

                    $answInput = $('<div />',{class:'answer-content ctrl-bar'});
                    $answInput.append('<input type="text" name="user_search" placeholder="请输入回复内容" />'+
                        '<span diss-id='+discList[i].discussion_id+' class="reply">回复</span>');
                    $("#discussion").append($quesAnsw);
                    
                    $quesAnsw.append($parentDiv);
                    $parentDiv.append($headPic);
                    $parentDiv.append($quesUser);
                    $parentDiv.append($quesCon);
                    $parentDiv.append($answCon);
                    $parentDiv.append($answInput);


                }
                $(".reply").on("click", function(event){
                        var $this = $(this);
                        var content = $this.prev().val();
                        //连接服务器提交回复
                        var params = {
                            "content": content,
                            "discussion_id":  $this.attr("diss-id")
                        }
                        $.ajax({  
                                type: 'POST',  
                                url: 'http://115.159.188.200:8000/post_reply/',  
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
                                    if(data.code=="1000"){
                                        console.log($answCon);
                                        console.log(sessionStorage.getItem("userId"));
                                        $this.parent().prev().append('<p>'+ sessionStorage.getItem("userName") +'：'+content+'</p>');
                                        $this.prev().val("");
                                        //window.location.href='lesson.html?chapter_id='+GetQueryString("chapter_id")+'&course_id='+GetQueryString("course_id")+'&video_id='+GetQueryString("video_id");
                                    }
                                },
                                //error:function(XMLHttpRequest, textStatus, errorThrown){
                                //通常情况下textStatus和errorThrown只有其中一个包含信息
                                error: function(XMLHttpRequest, textStatus, errorThrown) {
                                    window.alert(textStatus);
                                }
                        });
                        
                });

            },
            //error:function(XMLHttpRequest, textStatus, errorThrown){
            //通常情况下textStatus和errorThrown只有其中一个包含信息
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                window.alert(textStatus);
            }
    }); 

    /**
    下面是视频和pdf的获取
    **/


    var videoId = GetQueryString("video_id");
    var pdfId = GetQueryString("pdf_id");
    
    //连接服务器获取视频地址
    var videoParams = {"video_id": videoId}
    var videoUrl;
    $.ajax({  
            type: 'POST',  
            url: "http://115.159.188.200:8000/get_video/",  
            dataType: 'json',  
            data: videoParams,
            //下面2个参数用于解决跨域问题  
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,

            complete: function(XMLHttpRequest, textStatus) { 
            },  
            success: function(data) {  
                
                videoUrl = data.url;
                console.log(videoUrl);
                //视频插件加载
                var flashvars={
                    p:0,
                    e:1,
                    h:0,
                    i:'http://115.159.188.200:8000/media/cover/default.png'
                };
                var video=['http://115.159.188.200:8000'+videoUrl+'->video/mp4'];
                var support=['all'];
                CKobject.embedHTML5('a1','ckplayer_a1',650,433,video,flashvars,support);
            },
            //error:function(XMLHttpRequest, textStatus, errorThrown){
            //通常情况下textStatus和errorThrown只有其中一个包含信息
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                window.alert(textStatus);
            }
    });

    

    

    //侧边栏js
    $('.menu , .linee').on('click', function() {
        $('.menu').toggleClass('over')
        $('.linea1').toggleClass('overL1')
        $('.linea2').toggleClass('overL2')
        $('.linea3').toggleClass('overL3')
        $('.main-menu').toggleClass('overmain')
    });  
    

    //滚动条js
    (function($){
        $(window).load(function(){
            $("#content1").mCustomScrollbar({
                autoHideScrollbar:true,
                theme:"light-thin"
            });
        });
    })(jQuery);     
});
