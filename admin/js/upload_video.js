//点击单门课程后，获取该门课程的所有章节列表
    function createChapters(){
        var cour = $("#courses_names option:selected");
        // console.log(cour.attr('courseid'));
        $.ajax({
                type: "POST",
                url: "http://115.159.188.200:8000/get_chapter/",
                data: 'id='+cour.attr('courseid'),
                dataType: "json",
                async: false,
                //下面2个参数用于解决跨域问题  
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function(data){
                    console.log(data);
                    if(data.code==1000){
                        //获取成功
                        $("#chapters_names").empty();
                        for (var i = 0; i < data.chapters.length; i++) {
                            var $opt = $('<option></option>',{class: 'chapter',html: data.chapters[i].name});
                            $opt.text(data.chapters[i].name);
                            $opt.attr('chapterid', data.chapters[i].id);
                            $("#chapters_names").append($opt);
                        };
                    }else if(data.code==1001){
                        window.alert("您尚未登录。");
                    }else{
                        window.alert(data.msg);
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    window.alert(textStatus);
                }
        });
        
    }

//点击章节后，设置要提交的章节id
    function selectChapter(){
        var cour = $("#chapters_names option:selected");
        $('#hiddenId').val(cour.attr('chapterid'));
    }

$(function() {

    //从服务器获取所有课程并自动生成
    $.ajax({
        type: "POST",
        url: "http://115.159.188.200:8000/get_all_courses/",
        data: "limit=100&page=1",
        dataType: "json",
        //下面2个参数用于解决跨域问题  
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data){
            console.log("获取所有课程：");
            console.log(data);
            if(data.code==1000){
                for (var i = 0; i < data.courses.length; i++) {
                    var $opt = $('<option></option>',{class: 'course',html: data.courses[i].name});
                    $opt.text(data.courses[i].name);
                    $opt.attr('courseid', data.courses[i].id);
                    $("#courses_names").append($opt);
                };
            }else if(data.code==1001){
                window.alert("您尚未登录。");
            }else if(data.code==1002){
                window.alert("您不是管理员，没有此权限。");
            }else{
                window.alert(data.msg);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            window.alert(textStatus);
        }
    });


    console.log($("#uploadVideo"));

    //点击“上传视频”提交信息给服务器
    $("#uploadVideo").on('click', function(){
        var formData =  new FormData(document.forms.namedItem("upload"));
        //视频名和index不为空
        if($('input[name="name"]').val()==""||$('input[name="index"]').val()==""){
            return;
        }
        
        $.ajax({
                type: "POST",
                url: "http://115.159.188.200:8000/add_video/",
                data: formData,
                dataType: "json",
                async: false, 
                // 告诉jQuery不要去处理发送的数据
                processData : false, 
                // 告诉jQuery不要去设置Content-Type请求头
                contentType : false,
                //下面2个参数用于解决跨域问题  
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function(data){
                    console.log(data);
                    if(data.code==1000){
                        window.alert("上传视频成功");
                    }else if(data.code==1001){
                        window.alert("您尚未登录。");
                    }else if(data.code==1002){
                        window.alert("您不是管理员，没有此权限。");
                    }else if(data.code==1003){
                        window.alert("同序号存在，请先删除。");
                    }else{
                        window.alert(data.code+"  "+data.msg);
                    }
                },
                complete: function(XMLHttpRequest, textStatus) {
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    window.alert(textStatus);
                }
        });
        
    });


    
    
});



