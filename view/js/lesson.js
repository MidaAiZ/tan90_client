$(function() {

    //获取参数方法
    function GetQueryString(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  decodeURI(r[2]); return null;
    }

    //获取页面关闭事件
    window.onbeforeunload = function(){
        console.log('关闭页面');
        $.ajax({
                type: 'POST',
                url: 'http://115.159.188.200:8000/exit_course/',
                dataType: 'json',
                data: 'course_id=' + GetQueryString('course_id'),
                //下面2个参数用于解决跨域问题
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                complete: function(XMLHttpRequest, textStatus) {
                },
                success: function(data) {
                    if(data.code==1000){
                        console.log("post开始时间成功。");
                    }else{
                        console.log(data.msg);
                    }
                },
                //error:function(XMLHttpRequest, textStatus, errorThrown){
                //通常情况下textStatus和errorThrown只有其中一个包含信息
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    window.alert(textStatus);
                }
        });
        return "hhhhhh确认退出?";
    }
    window.onload = function(){
        console.log('打开页面');
        $.ajax({
                type: 'POST',
                url: 'http://115.159.188.200:8000/watch_course/',
                dataType: 'json',
                data: 'course_id=' + GetQueryString('course_id'),
                //下面2个参数用于解决跨域问题
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                complete: function(XMLHttpRequest, textStatus) {
                },
                success: function(data) {
                    if(data.code==1000){
                        console.log("post开始时间成功。");
                    }else{
                        console.log(data.msg);
                    }
                },
                //error:function(XMLHttpRequest, textStatus, errorThrown){
                //通常情况下textStatus和errorThrown只有其中一个包含信息
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    window.alert(textStatus);
                }
        });
        return "打开了";
    }

    //计算数组长度
    function count(str){
        var s = typeof str;
        if(s == 'object'){
            if(str.toString().length == 0){
                return 0;
            }else{
                var i = 0;
                for(var j in str){
                    i++;
                }
                return i;
            }
        }
    }


    //catalog为存放各节视频、pdf信息的数组
    var catalog = new Array();
    var chapsname = new Array();
    var t = 0;//t用于catalog数组计数

    var lessonIdx = GetQueryString("lesson_index");
    var chapterIdx = GetQueryString("chapter_index");

    //设置catalog数组
    function setCatalogArray(data){
        //将返回数据存入catalog数组
        if(data.code==1000){
            for (var i = 0; i < data.chapters.length; i++) {
                  chapsname[i] = (data.chapters[i]).name;
                  var chapterid = (data.chapters[i]).id;
                  var chaptername = (data.chapters[i]).name;
                  var chapterindex = (data.chapters[i]).index;


                  $.ajax({
                      type: 'POST',
                      url: "http://115.159.188.200:8000/get_section/",
                      dataType: 'json',
                      data: "chapter_id="+chapterid,
                      //下面2个参数用于解决跨域问题
                      xhrFields: {
                          withCredentials: true
                      },
                      crossDomain: true,
                      async: false,
                      complete: function(XMLHttpRequest, textStatus) {
                      },
                      success: function(data) {
                          console.log(data);
                          for (var i = 0; i < data.sections.length; i++) {
                              catalog[t] = {"chapterId": chapterid,
                                  "chapterIndex": chapterindex,
                                  "chapterName": chaptername,
                                  "sectionId":(data.sections[i]).id,
                                  "sectionIndex":(data.sections[i]).index,
                                  "sectionName":(data.sections[i]).name
                              };
                              t++;
                          };

                      },
                      //error:function(XMLHttpRequest, textStatus, errorThrown){
                      //通常情况下textStatus和errorThrown只有其中一个包含信息
                      error: function(XMLHttpRequest, textStatus, errorThrown) {
                          window.alert(textStatus);
                      }
                  });

            };
        }

    }

    //动态生成课程目录
    function createCatalogItems(data){
            //动态生成课程内容及目录

                $("#course-name").text(data.course_name);
                $("#course-intro").text("课程简介："+data.course_introduce);
                $(".img-responsive").attr('src','http://115.159.188.200:8000'+data.cover);

                var chaps = data.chapters;
                if(data.code==1000){
                for (var i=0; i<data.chapters.length;i++){
                    $("#chapter").append('<h3>第'+chaps[i].index+'章 '+chaps[i].name+'</h3>');
                    var $list = $('<ul></ul>');
                    $("#chapter").append($list);
                    for (var j=0; j<count(catalog);j++) {
                        if(catalog[j].chapterId==chaps[i].id){
                            var $part = $('<a></a>',{class: 'part',
                                    html: '<li>'+catalog[j].chapterIndex+'-'+catalog[j].sectionIndex+'  '+catalog[j].sectionName+'</li>'});
                            $part.attr('chapter-index', catalog[j].chapterIndex);
                            $part.attr('chapter-id', catalog[j].chapterId);
                            $part.attr('section-index', catalog[j].sectionIndex);
                            $part.attr('section-id', catalog[j].sectionId);
                            $list.append($part);
                        }

                    };
                };


                $(".part").on("click", function(event){
                    var $this = $(this);
                    window.location.href='lesson.html?course_id='+GetQueryString("course_id")+'&chapter_index='+$this.attr("chapter-index")+'&lesson_index='+$this.attr("section-index");
                });
                }
    }


    //连接服务器获取课程详细内容
    var params = "id="+ GetQueryString("course_id");
    var url = "http://115.159.188.200:8000/get_chapter/";
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

                //设置catalog数组
                setCatalogArray(data);

                console.log("catalog如下：");
                console.log(catalog);
                console.log("chapsname如下：");
                console.log(chapsname);

                for (var i=0;i<count(catalog);i++) {
                    if(chapterIdx==catalog[i].chapterIndex&&lessonIdx==catalog[i].sectionIndex){
                        $("#lesson-title").text(chapterIdx+'-'+lessonIdx+' '+catalog[i].sectionName);

                        $.ajax({
                            type: 'POST',
                            url: "http://115.159.188.200:8000/get_content/",
                            dataType: 'json',
                            data: "section_id="+catalog[i].sectionId,
                            //下面2个参数用于解决跨域问题
                            xhrFields: {
                                withCredentials: true
                            },
                            crossDomain: true,
                            async: false,
                            complete: function(XMLHttpRequest, textStatus) {
                            },
                            success: function(data) {
                                console.log(data);
                                if(data.code==1000){
                                    var flagV = false;
                                    var flagA = false;
                                    var flagP = false;
                                    if(data.contents.length==0){
                                        $('.abt-pic').append("<p style='margin-top:60px'>该节尚未有课程资料，请等待管理员上传。</p>")
                                    }
                                    for (var i = 0; i < data.contents.length; i++) {
                                        if(data.contents[i].type=="V"){
                                            flagV = true;
                                            videoUrl = data.contents[i].url;
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
                                        }else if(data.contents[i].type=="A"){
                                            flagA = true;
                                            audioUrl = data.contents[i].url;
                                            console.log(audioUrl);
                                            //视频插件加载
                                            var flashvars={
                                                p:0,
                                                e:1,
                                                h:0,
                                                i:'http://115.159.188.200:8000/media/cover/default.png'
                                            };
                                            var video=['http://115.159.188.200:8000'+audioUrl];
                                            var support=['all'];
                                            CKobject.embedHTML5('a2','ckplayer_a1',650,433,video,flashvars,support);
                                        }else if(data.contents[i].type=="P"){
                                            flagP = true;
                                            pdfUrl = data.contents[i].url;
                                            console.log(pdfUrl);
                                            $('#pdf-iframe').attr('src', 'http://115.159.188.200:8000'+pdfUrl);
                                        }
                                    };
                                    if(flagV==false) {
                                        // 删除video选项卡
                                        var $pdf = document.getElementById("tab1");
                                        $pdf.parentNode.removeChild($pdf);
                                    }
                                    if(flagA==false) {
                                        // 删除pdf选项卡
                                        var $audio = document.getElementById("tab2");
                                        $audio.parentNode.removeChild($audio);
                                    }
                                    if(flagP==false) {
                                        // 删除pdf选项卡
                                        var $video = document.getElementById("tab3");
                                        $video.parentNode.removeChild($video);
                                    }
                                }

                            },
                            //error:function(XMLHttpRequest, textStatus, errorThrown){
                            //通常情况下textStatus和errorThrown只有其中一个包含信息
                            error: function(XMLHttpRequest, textStatus, errorThrown) {
                                window.alert(textStatus);
                            }
                        });

                        $(".tab-group").tabify();

                        //配置上一节下一节
                        if(i==0){
                            $("#last-lesson").remove();
                        }
                        if(i>0){
                            $("#last-lesson").attr('href','lesson.html?course_id='+GetQueryString("course_id")+'&chapter_index='+catalog[i-1].chapterIndex+'&lesson_index='+catalog[i-1].sectionIndex);
                        }
                        if(i<count(catalog)-1){
                            $("#next-lesson").attr('href','lesson.html?course_id='+GetQueryString("course_id")+'&chapter_index='+catalog[i+1].chapterIndex+'&lesson_index='+catalog[i+1].sectionIndex);
                        }
                        if(i==count(catalog)-1){
                            $("#next-lesson").remove();
                        }


                        setDiscussion(catalog[i].chapterId);
                    }

                };



                //动态生成课程内容及目录
                createCatalogItems(data);

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

    function setDiscussion(chapterid) {
        var $answInput;
        var $answCon;

    //生成新的提问
    $("#my-avatar").attr('src','http://115.159.188.200:8000'+sessionStorage.getItem("userAvatar"));
    $("#my-name").text(sessionStorage.getItem("userName"));
    $("#my-department").text(sessionStorage.getItem("userDep"));
    $(".newQues").on("click", function(event){
        var $this = $(this);
        var content = $this.prev().val();
        //连接服务器提交回复
        var params = {"title": content,
                      "content": content,
                      "chapter_id":  chapterid
                     }
        $.ajax({
                type: 'POST',
                url: 'http://115.159.188.200:8000/post_new_discution/',
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
                    if(data.code=="1000"){
                        window.location.reload();
                    }
                },
                //error:function(XMLHttpRequest, textStatus, errorThrown){
                //通常情况下textStatus和errorThrown只有其中一个包含信息
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    window.alert(textStatus);
                }
        });

    });

    //连接服务器获取讨论区内容

    var params = {"limit": 5,
                    "page_index": 1,
                    "chapter_id":  chapterid
                  };

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
                    $answInput.append('<input type="text" class="replytext" name="replytext" placeholder="请输入回复内容" />'+
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

    }



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
