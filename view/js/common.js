ROOT = "http://115.159.188.200:8000/"

$(function() {
    if (sessionStorage.getItem("userId")) {
        initUInfo();
    } else {
        initSession();
        // 强行转跳到首页
        if (window.location.pathname == "/view/") {
            $(".modal.login").modal({
                show: true,
                keyboard: false
            })
            $(".modal.login").off("click");
        } else {
            window.location = "/view/"
        }
    }
})

function initUInfo() {
	$("#user-info").show();
    listenLogout();
}

function initSession() {
	$("#session-info").show()
    $("html").append(getLoginModal());

    $('#create').click(function() {
        register();
        return false;
    })
    $('#login').click(function(e) {
        login();
		e.stopPropagation();
        return false;
    })
    $('.message a, #signin-btn').click(function() {
        $('form').animate({
            height: 'toggle',
            opacity: 'toggle'
        }, 'slow');
    });
    initDepart();
}

function check_login(res) {
	if (res.code == 1000) {
        sessionStorage.setItem("userId", res.info.id);
        sessionStorage.setItem("userName", res.info.name);
        sessionStorage.setItem("userAvatar", res.info.face);
        sessionStorage.setItem("userDep", res.info.department);

        $(".login").modal("hide");
        window.location = "";
	} else {
		$('#login_form').removeClass('shake_effect');
        $("#tip").html("<span class='glyphicon glyphicon-exclamation-sign'>帐号或密码错误</span>");
	     setTimeout(function() {
	         $('#login_form').addClass('shake_effect')
	     }, 1);
	}
}

function check_register(res) {
    if (res.code == 1000) {
        $("#tip").html("<span class='glyphicon glyphicon-ok-sign' style='color: green;'>注册成功,请登录</span>");
        setTimeout(function() {
            $('form').animate({
                height: 'toggle',
                opacity: 'toggle'
            }, 'slow');
        }, 300);
    } else {
        $('#login_form').removeClass('shake_effect');
        $("#tip").html("<span class='glyphicon glyphicon-exclamation-sign'>注册失败</span>");
        setTimeout(function() {
            $('#login_form').addClass('shake_effect')
        }, 1);
    }
}

function getLoginModal() {
    var sLogin = "\
		<div class='modal fade login' tabindex='-1' role='dialog' aria-labelledby='mySmallModalLabel'>\
  			<div class='modal-dialog login-page' role='document'>\
				<div id='login_form' class='form'>\
                    <p id='tip' style='color: red; margin-bottom: 10px'></p>\
					<form class='register-form'>\
					  <input type='text' name='name' placeholder='用户名' id='r_user_name'/>\
					  <input type='password' name='pwd' placeholder='密码' id='r_password' />\
					  <input type='text' name='mail' placeholder='电子邮件' id='r_emial'/>\
                      <input type='text' name='code' placeholder='注册码' id='r_code'/>\
                      <select type='text' name='department' placeholder='所属部门' id='r_department' class='select'>\
                      </select>\
					  <button id='create'>创建账户</button>\
					  <p class='message'>已经有了一个账户? <a href='#'>立刻登录</a></p>\
					</form>\
					<form class='login-form'>\
					  <input type='text' name='mail' placeholder='邮箱' id='user_name'/>\
					  <input type='password' name='pwd' placeholder='密码' id='password'/>\
					  <button id='login'>登　录</button>\
					  <p class='message'>还没有账户? <a href='#'>立刻创建</a></p>\
					</form>\
				</div>\
  			</div>\
	    </div>\
	"
    return $(sLogin);
}

function listenLogout() {
    $("#logout").click(function() {
        $.ajax({
            url: ROOT + "do_logout/",
            type: "POST",
            dataType: "json",
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
            complete: function(res) {
                sessionStorage.removeItem("userId");
                sessionStorage.removeItem("userName");
                sessionStorage.removeItem("userAvatar");
                sessionStorage.removeItem("userDep");

                window.location = "";
            }
        })
    })
}

function login() {
	var fd = $(".login-form").serialize();
    var url = ROOT + "do_login/"
	$.ajax({
		url: url,
        type: "POST",
		data: fd,
		dataType: "json",
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
		success: function(res) {
			console.log(res);
			check_login(res);
		},
		error: function(err) {
			console.log(err);
		}
	});
}

function register() {
	var fd = $(".register-form").serialize();
    var url = ROOT + "do_register/"
	$.ajax({
		url: url,
        type: "POST",
		data: fd,
		dataType: "json",
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
		success: function(res) {
			console.log(res);
			check_register(res);
		},
		error: function(err) {
			console.log(err);
		}
	});
}

// 获取部门列表
function initDepart() {
    var departs = [];
    $.ajax({
        url: ROOT + "get_department/",
        dataType: "json",
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
		success: function(res) {
            departs = res.departments
            var $select = $("#r_department");
            departs.forEach(function(p) {
                var $e = $("<option value=" + p.name + ">" + p.name + "</option>")
                $select.append($e);
            })
            $('.select').each(function(){
                new Select({
                    el: this,
                    selectLikeAlignment: $(this).attr('data-select-like-alignement') || 'auto',
                    className: 'select-theme-default'
                });
            });
           $(".select-target").text("选择部门")
		}
    })
};

// 监听搜索栏
$(function() {
    var search = $("#nav-search");
    var form = search.parent("form");
    form.on("submit", function() {
        window.location = "/view/courses.html?course_name=" + search.val();
        return false;
    })
})
