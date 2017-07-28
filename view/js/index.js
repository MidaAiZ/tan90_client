ROOT = "http://115.159.188.200:8000/"
IMGROOT = "http://115.159.188.200:8000"

////////////////////////////////////////////////
//                 热门课程                    //
///////////////////////////////////////////////

// 首页课程第一部分
$(function() {
	getCourses(ROOT + "get_all_courses/", courseBK);
})

// 动态添加课程
function getCourses(url, callBK) {
	$.ajax({
		url: url,
		type: "POST",
		dataType: "json",
		crossDomain: true,
		xhrFields: {
			withCredentials: true
		},
		success: function(res) {
			if (res.code == 1000) {
				console.log(res.courses);
				callBK(res);
			} else {
				console.log(res.msg);
			}
		},
		error: function(err) {
			console.log(err);
		}
	})
}

// 回调函数
function courseBK(res) {
	var $box = $("#courseUl");
	var courses = res.courses
	var size = courses.length
	for(var i in courses) {
		$box.append(createCourse(courses[i]));
	}
	$box.on("click", "a", function() {
        window.location = $(this).data("href");
    })
	$("#courseUl").flexisel({
		visibleItems: 4,
		animationSpeed: 1000,
		autoPlay: true,
		autoPlaySpeed: 3000,
		pauseOnHover: true,
		enableResponsiveBreakpoints: true,
		responsiveBreakpoints: {
			portrait: {
				changePoint: 480,
				visibleItems: 1
			},
			landscape: {
				changePoint: 640,
				visibleItems: 2
			},
			tablet: {
				changePoint: 768,
				visibleItems: 3
			}
		}
	});
}

// 生成课程节点
function createCourse(course) {
	var liStr = "\
	<li>\
		<div class='course-grid' data-id='" + course.id + "'>\
		  	<a data-href='/view/catalog.html?course_id=" + course.id + "'>\
				<img src='" + IMGROOT + course.cover + "' class='img-responsive' alt=''/>\
		  	</a>\
			<h4 style='margin-top: 10px;'>" + course.name + "</h4>\
			<p>" + course.introduce + "|<span>" + course.category + "</span></p>\
		</div>\
	</li>\
	"
	return $(liStr);
}


////////////////////////////////////////////////
//                 最新课程                    //
///////////////////////////////////////////////

// 部分课程列表
$(function() {
	// ajax获取课程信息
	getCourses(ROOT + "get_all_courses/?count=4", trailerBK);
})

function trailerBK(res) {
	var $box = $("#trailerBox");
	var courses = res.courses
	for(var i in courses) {
		if(i > 3) break;
		$box.append(createTrailer(courses[i]));
	}
	$box.on("click", "a", function() {
		window.location = $(this).data("href");
	})
	$("#trailer-img").attr("src", "images/course.png");
}

function createTrailer(course) {
	var liStr = "\
	<div class='sub-trailer'>\
		<div class='col-md-4 sub-img'>\
			<a data-href='/view/catalog.html?course_id=" + course.id + "'><img src='" + IMGROOT + course.cover + "' alt='img07'/></a>\
		</div>\
		<div class='col-md-8 sub-text'>\
			<a data-href='/view/catalog.html?course_id=" + course.id + "'>" + course.name +
			"<span style='margin-top: -5px; border: 2px solid #ddd; border-radius: 30%; padding: 3px; float: right;'>"+ course.category +"</span></a>\
			<p>" + course.introduce + "</p>\
		</div>\
		<div class='clearfix'></div>\
	</div>\
	"
	return $(liStr);
}
