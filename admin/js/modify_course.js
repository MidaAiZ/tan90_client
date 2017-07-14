$(function(){
    //获取url中的参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var pa = decodeURI(window.location.search);
        var r = pa.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }
    $("#inputId").attr('placeholder',getUrlParam('course_id'));
    $("#hiddenId").val(getUrlParam('course_id'));
    $("#inputName").attr('placeholder',getUrlParam('course_name'));
    $("#inputIntro").attr('placeholder',getUrlParam('course_introduce'));

    $("#sub").on('click',function(){
        if($("#inputName").val().trim()==""&&$("#inputIntro").val().trim()==""&&$("#inputCover").val()==""){
            //没有任何参数改变 直接返回
            return;
        }else if($("#inputName").val().trim()==""&&$("#inputIntro").val().trim()==""){
            //封面有改变
            var formData =  new FormData(document.forms.namedItem("setCover"));
            $.ajax({
                type: "POST",
                url: "http://115.159.188.200:8000/add_course_cover/",
                data: formData,
                dataType: "json",
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
                    if(data.code==1000){
                        window.alert("修改封面成功");
                        window.location.href="all_courses.html";
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
        }else if($("#inputCover").val()==""){
            //名称或简介有改变
            var param1 = "course_id="+getUrlParam('course_id');
            var param1;
            if($("#inputName").val().trim()!=""){
                param1 = param1 + ("&name="+$("#inputName").val());
            }
            if($("#inputIntro").val().trim()!=""){
                param1 = param1 + ("&introduce="+$("#inputIntro").val());
            }
            $.ajax({
                type: "POST",
                url: "http://115.159.188.200:8000/modify_course_info/",
                data: param1,
                dataType: "json",
                //下面2个参数用于解决跨域问题  
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function(data){
                    if(data.code==1000){
                        window.alert("修改成功");
                        window.location.href="all_courses.html";
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
        }else{
            //都有改变
            var flag1 = false;
            var param1 = "course_id="+getUrlParam('course_id');
            var param1;
            if($("#inputName").val().trim()!=""){
                param1 = param1 + ("&name="+$("#inputName").val());
            }
            if($("#inputIntro").val().trim()!=""){
                param1 = param1 + ("&introduce="+$("#inputIntro").val());
            }
            $.ajax({
                type: "POST",
                url: "http://115.159.188.200:8000/modify_course_info/",
                data: param1,
                dataType: "json",
                async: false,
                //下面2个参数用于解决跨域问题  
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function(data){
                    if(data.code==1000){
                        flag1=true;
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

            var flag2=false;
            var formData =  new FormData(document.forms.namedItem("setCover"));
            $.ajax({
                type: "POST",
                url: "http://115.159.188.200:8000/add_course_cover/",
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
                    if(data.code==1000){
                        flag2=true;
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

            if(flag1==true&&flag2==true){
                window.alert("修改成功");
                window.location.href="all_courses.html";
            }
        }
        

    })
})