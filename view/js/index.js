// 首页课程第一部分
$(function() {
	// ajax获取课程信息
	var courses = [{
		name: "cName1",
		intro: "cintro1",
		url: "images/course.png"
	}, {
		name: "cName2",
		intro: "cintro2",
		url: "images/course.png"
	}, {
		name: "cName3",
		intro: "cintro3",
		url: "images/course.png"
	}, {
		name: "cName4",
		intro: "cintro4",
		url: "images/course.png"
	}, {
		name: "cName5",
		intro: "cintro5",
		url: "images/course.png"
	}]

	var $box = $("#courseUl");
	for(var i in courses) {
		$box.append(createCourse(courses[i]));
	}
})

function createCourse(course) {
	var liStr = "\
	<li>\
		<div class='game-grid'>\
			<img src='" + course.url + "' class='img-responsive' alt=''/>\
			<h4 style='margin-top: 10px;'>" + course.name + "</h4>\
			<p>" + course.intro + "</p>\
		</div>\
	</li>\
	"
	return $(liStr);
}


// 部分课程列表
$(function() {
	// ajax获取课程信息
	var courses = [{
		name: "cName1",
		intro: "cintro1",
		url: "images/course.png"
	}, {
		name: "cName2",
		intro: "cintro2",
		url: "images/course.png"
	}, {
		name: "cName3",
		intro: "cintro3",
		url: "images/course.png"
	}, {
		name: "cName4",
		intro: "cintro4",
		url: "images/course.png"
	}]

	var $box = $("#trailerBox");
	for(var i in courses) {
		$box.append(createTrailer(courses[i]));
	}
	$("#trailer-img").attr("src", "images/course.png");
})

function createTrailer(course) {
	var liStr = "\
	<div class='sub-trailer'>\
		<div class='col-md-4 sub-img'>\
			<img src='" + course.url + "' alt='img07'/>\
		</div>\
		<div class='col-md-8 sub-text'>\
			<a href='#'>\
				"+ course.name +"</a>\
			<p>" + course.intro + "</p>\
		</div>\
		<div class='clearfix'></div>\
	</div>\
	"
	return $(liStr);
}

$(function() {
	$.ajax({
		url: "http://115.159.188.200:8000/do_login/",
		type: "POST",
		// dataType: "text/html",
		success: function(res) {
			console.log(res);
		},
		error: function(err) {
			// alert("Fail");
			console.log(err);
		},
		beforeSend: function(XHR) {
			XHR.setRequestHeader("Accept", "text/html");
		}
	})
})
