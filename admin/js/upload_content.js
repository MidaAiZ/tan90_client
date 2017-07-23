    //获取参数方法
    function GetQueryString(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  decodeURI(r[2]); return null;
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

    //点击章后，获取该章的所有节
    function showSections(){
        var chap = $("#chapters_names option:selected");
        $.ajax({
                type: "POST",
                url: "http://115.159.188.200:8000/get_section/",
                data: 'chapter_id='+chap.attr('chapterid'),
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
                        $("#sections_names").empty();
                        for (var i = 0; i < data.sections.length; i++) {
                            var $opt = $('<option></option>',{class: 'section',html: data.sections[i].name});
                            $opt.text(data.sections[i].name);
                            $opt.attr('sectionid', data.sections[i].id);
                            $("#sections_names").append($opt);
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

    

//点击节后，设置要提交的节id
    function selectChapter(){
        var cour = $("#sections_names option:selected");
        $('#hiddenId').val(cour.attr('sectionid'));
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
        {text: '<span class="glyphicon glyphicon-trash"></span>&nbsp;&nbsp;删除', action: function(e) {
            //向服务器请求删除章
            var chapterid = $(context.target).attr('chapterid');
            $.ajax({
                type: "POST",
                url: "http://115.159.188.200:8000/del_chapter/",
                data: 'chapter_id='+chapterid,
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
                        //删除章成功
                        showChapters();
                    }else if(data.code==1001){
                        window.alert("您尚未登录。");
                    }else if(data.code==4000){
                        window.alert(data.msg);
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    window.alert(textStatus);
                }
            });
        }}
        // {text: '<span class="glyphicon glyphicon-edit"></span>&nbsp;&nbsp;修改', action: function(e) {
        //     //向服务器请求修改章
        //     var chapterid = $(context.target).attr('chapterid');
        // }}
    ]);

    context.attach('.section', [
        {text: '<span class="glyphicon glyphicon-trash"></span>&nbsp;&nbsp;删除', action: function(e) {
            //向服务器请求删除节
            var sectionid = $(context.target).attr('sectionid');
            $.ajax({
                type: "POST",
                url: "http://115.159.188.200:8000/del_section/",
                data: 'section_id='+sectionid,
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
                        //删除节成功
                        showSections();
                    }else if(data.code==1001){
                        window.alert("您尚未登录。");
                    }else if(data.code==1003){
                        window.alert("该节不为空，不可删除，请先删除节内资料。");
                    }else{
                        window.alert(data.msg);
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    window.alert(textStatus);
                }
            });
        }}
        // {text: '<span class="glyphicon glyphicon-edit"></span>&nbsp;&nbsp;修改', action: function(e) {
        //     // 向服务器请求修改节
        //     var sectionid = $(context.target).attr('sectionid');
        // }}
    ]);

   
});

$(function() {

    $('#course-name').text("上传课程资料 至 "+(GetQueryString('course_name')));

    setChapters();

    
    //添加章
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

    //添加节
    $("#add_section").on('click',function(){
        var newname = $('#new-sec-name').val();
        var newid = $('#new-sec-id').val();
        $.ajax({
            type: "POST",
            url: "http://115.159.188.200:8000/add_section/",
            data: "chapter_id="+$("#chapters_names option:selected").attr('chapterid')+"&index="+newid+"&section_name="+newname,
            dataType: "json",
            //下面2个参数用于解决跨域问题  
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function(data){
                if(data.code==1000){
                    showSections()
                    $('.bs-newsection-modal-lg').modal('hide');
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

    //点击“上传”提交信息给服务器
    $("#uploadVideo").on('click', function(){
        var formData =  new FormData(document.forms.namedItem("upload"));
        //视频名和index不为空
        if($('input[name="name"]').val()==""||$('input[name="index"]').val()==""){
            return;
        }
        
        $.ajax({
                type: "POST",
                url: "http://115.159.188.200:8000/add_content/",
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
                        window.alert("上传课程资料成功");
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



