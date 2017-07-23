    //获取参数方法
    function GetQueryString(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }

    function setChapters () {
        //获取该门课程的所有章节列表
        $.ajax({
                type: "POST",
                url: "http://115.159.188.200:8000/get_chapter/",
                data: 'id='+GetQueryString('course_id'),
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

$(document).ready(function(){
    //右键初始化
    context.init({
        fadeSpeed: 100,
        filter: function ($obj){},
        above: 'auto',
        preventDoubleContext: true,
        compress: false
    });

    context.attach('.chapter', [
        {text: '<span class="glyphicon glyphicon-trash"></span>&nbsp;&nbsp;删除', action: function function_name (argument) {
            // 向服务器请求删除
        }},
        {text: '<span class="glyphicon glyphicon-edit"></span>&nbsp;&nbsp;修改', action: function function_name (argument) {
            // 向服务器请求修改
        }}
    ]);

   
});

$(function() {

    setChapters();

    

    $("#add_chapter").on('click',function(){
        var newname = $('#new-chap-name').val();
        var newid = $('#new-chap-id').val();

        $.ajax({
            type: "POST",
            url: "http://115.159.188.200:8000/add_chapter/",
            data: "course_id="+GetQueryString('course_id')+"&chapter_id="+newid+"&name="+newname,
            dataType: "json",
            //下面2个参数用于解决跨域问题  
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function(data){
                if(data.code==1000){
                    setChapters();
                    $('.bs-newchapter-modal-lg').modal('hide');
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
    })


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



