$(function() {

    //catalog为存放各节视频、pdf信息的数组
    var catalog = new Array();
    var chapsname = new Array();
    var t = 0;//t用于catalog数组计数

    //获取参数方法
    function GetQueryString(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
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


    //设置catalog数组
    function setCatalogArray(data){
        //将返回数据存入catalog数组
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

    //动态生成课程目录
    function createCatalogItems(data){
            //动态生成课程内容及目录

                $("#course-name").text(data.course_name);
                $("#course-intro").text("课程简介："+data.course_introduce);
                $(".img-responsive").attr('src','http://115.159.188.200:8000'+data.cover);

                var chaps = data.chapters;
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


    //连接服务器获取课程详细内容
    var params = "id=" + GetQueryString("course_id");
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
                if(data.code==1000){
                    //设置课程是否已选中
                    if(data.course_selected==false){
                        $('#withdraw-course').hide();
                    }else{
                        $('#choose-course').hide();
                    }

                    //设置catalog数组
                    setCatalogArray(data);

                    console.log("catalog如下：");
                    console.log(catalog);
                    console.log("chapsname如下：");
                    console.log(chapsname);

                    //动态生成课程内容及目录
                    createCatalogItems(data);
                }
            },
            //error:function(XMLHttpRequest, textStatus, errorThrown){
            //通常情况下textStatus和errorThrown只有其中一个包含信息
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                window.alert(textStatus);
            }
    });


    //点击选课按钮
    $('#choose-course').on('click',function() {
        $.ajax({
            type: 'POST',
            url: "http://115.159.188.200:8000/user_add_course/",
            dataType: 'json',
            data: "course_id=" + GetQueryString("course_id"),
            //下面2个参数用于解决跨域问题
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            complete: function(XMLHttpRequest, textStatus) {
            },
            success: function(data) {
                console.log(data);
                if(data.code==1000){
                    window.alert("选课成功。");
                    $('#choose-course').hide();
                    $('#withdraw-course').show();
                    if(window.confirm("是否现在开始学习？")==true){
                        window.location.href = 'lesson.html?course_id=' + GetQueryString("course_id")+'&chapter_index=1&lesson_index=1';
                    }
                }else if(data.code==1001){
                    window.alert("您尚未登录。");
                }else if(data.code==1003){
                    window.alert("您无权选择该课程。");
                }else if(data.code==1004){
                    window.alert("您已选过该课程。");
                    $('#choose-course').hide();
                    $('#withdraw-course').show();
                }else{
                    window.alert("服务器内部错误");
                }

            },
            //error:function(XMLHttpRequest, textStatus, errorThrown){
            //通常情况下textStatus和errorThrown只有其中一个包含信息
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                window.alert(textStatus);
            }
        });
    })


    //点击退选按钮
    $('#withdraw-course').on('click',function() {
        $.ajax({
            type: 'POST',
            url: "http://115.159.188.200:8000/user_del_course/",
            dataType: 'json',
            data: "id=" + GetQueryString("course_id"),
            //下面2个参数用于解决跨域问题
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,

            complete: function(XMLHttpRequest, textStatus) {
            },
            success: function(data) {
                console.log(data);
                if(data.code==1000){
                    window.alert("退选成功。");
                    $('#withdraw-course').hide();
                    $('#choose-course').show();
                }else if(data.code==1001){
                    window.alert("您尚未登录。");
                }else if(data.code==1002){
                    window.alert("您尚未选中该课程。");
                    $('#withdraw-course').hide();
                    $('#choose-course').show();
                }else{
                    window.alert("服务器内部错误");
                }

            },
            //error:function(XMLHttpRequest, textStatus, errorThrown){
            //通常情况下textStatus和errorThrown只有其中一个包含信息
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                window.alert(textStatus);
            }
        });
    })

})
