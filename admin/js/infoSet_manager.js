$(function(){
    //获取部门列表
    $.ajax({
        type: "POST",
        url: "http://115.159.188.200:8000/get_department/",
        data: "",
        dataType: "json",
        async: false,
        //下面2个参数用于解决跨域问题  
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data){
            console.log(data);
            if(data.code=="1000"){
                for (var i = 0; i < data.departments.length; i++) {
                    var $opt = $('<option></option>',{value: data.departments[i].name, html: data.departments[i].name});
                    $opt.attr('depId', data.departments[i].id);
                    $("#department").append($opt);
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

    //获取用户信息
    $.ajax({
        type: "POST",
        url: "http://115.159.188.200:8000/get_user_info/",
        data: "",
        dataType: "json",
        async: false,
        //下面2个参数用于解决跨域问题  
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data){
            console.log(data);
            if(data.code=="1000"){
                $('#name').val(data.name);
                $('#phone').val(data.phone);
                $('#department').children().each(function() {
                    if($(this).text()==data.department){
                        $(this).attr('selected',true);
                    }
                });
                $('#gender').children().each(function() {
                    if($(this).text()==data.gender){
                        $(this).attr('selected',true);
                    }
                });
                $('#intro').val(data.introduce);
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

    var param = 'name=' + $('#name').val() + '&name=' + $('#name').val();

    $('#submit').on('click',function(){
        //修改用户信息
        var param = "";

        param += "name=";
        param += document.getElementById("name").value;

        param += "&phone=";
        param += document.getElementById("phone").value;

        param += "&introduce=";
        param += document.getElementById("intro").value;

        if(document.getElementById("password").value!=""){
            param += "&old_password=";
            param += document.getElementById("password").value;
            param += "&new_password=";
            param += document.getElementById("new_password").value;
        }

        param += "&gender=";
        param += $("#gender").find("option:selected").text();

        param += "&department=";
        param += $("#department").find("option:selected").text();

        $.ajax({
            type: "POST",
            url: "http://115.159.188.200:8000/do_modify_user_profile/",
            data: param,
            dataType: "json",
            //下面2个参数用于解决跨域问题  
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function(data){
                console.log(data);
                if(data.code=="1000"){
                    window.alert("修改成功");
                }else if(data.code==1001){
                    window.alert("您尚未登录。");
                }else if(data.code==1002){
                    window.alert("旧密码错误。");
                }else{
                    window.alert(data.msg);
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                window.alert(textStatus);
            }
        });
    })
})