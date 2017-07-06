ROOT = "http://115.159.188.200:8000/"

$(function() {
    if (sessionStorage.getItem("userId")) {
        initUInfo();
    } else {
        initSession();
    }
})

function initUInfo() {
	$("#user-info").show();
}

function initSession() {
	$("#session-info").show()

    $("body").append(getLoginModal());

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
}

function check_login(res) {
	if (res.code == 1000) {
        alert('登录成功！');
	} else {
		$('#login_form').removeClass('shake_effect');
	     setTimeout(function() {
	         $('#login_form').addClass('shake_effect')
	     }, 1);
	}
}

function check_register(res) {
    if (res.code == 1000) {
        alert('注册成功！');
    } else {
        $('#login_form').removeClass('shake_effect');
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
					<form class='register-form'>\
					  <input type='text' name='name' placeholder='用户名' id='r_user_name'/>\
					  <input type='password' name='pwd' placeholder='密码' id='r_password' />\
					  <input type='text' name='mail' placeholder='电子邮件' id='r_emial'/>\
					  <input type='text' name='department' placeholder='所属部门' id='r_department'/>\
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

function getLogoutModel() {

}

function login() {
	var fd = $(".login-form").serialize();
    var url = ROOT + "do_login/"
	$.ajax({
		url: url,
        type: "POST",
		data: fd,
		dataType: "json",
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
		success: function(res) {
			console.log(res);
			check_register(res);
		},
		error: function(err) {
			console.log(err);
		}
	});
}
