$(function() {

    //获取参数方法
    function GetQueryString(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }

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
    
    //连接服务器获取视频地址
    var videoParams = {"video_id": GetQueryString("video_id")}
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
