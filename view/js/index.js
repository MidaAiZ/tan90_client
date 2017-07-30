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
		data: {
		    page: 1,
			limit: 8
		},
		dataType: "json",
		crossDomain: true,
		xhrFields: {
			withCredentials: true
		},
		success: function(res) {
			if (res.code == 1000) {
				callBK(res);
			} else {
			}
		},
		error: function(err) {
			$.console.error(err);
		}
	})
}

// 回调函数
function courseBK(res) {
	var $box = $("#courseUl");
	var courses = res.courses;

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
	setLabelCourse(courses);
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
	getCourses(ROOT + "get_all_courses/?page=1&limit=4", trailerBK);
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
			<a data-href='/view/lesson.html?chapter_id=1&course_id=" + course.id + "'>" +
			"<span class='c-text'>" + course.name + "</span>" +
			"<span class='c-label'>"+ course.category +"</span></a>\
			<p>" + course.introduce + "</p>\
		</div>\
		<div class='clearfix'></div>\
	</div>\
	"
	return $(liStr);
}


////////////////////////////////////////////////
//                 热门讨论                    //
///////////////////////////////////////////////

$(function() {
	// ajax获取课程信息
	createDisc();
})
function createDisc() {
	$.ajax({
		url: ROOT + 'hot_discussions/',
		type: 'POST',
		data: {
			page: 1,
			limit: 8
		},
		dataType: 'JSON',
		crossDomain: true,
		xhrFields: {
			withCredentials: true
		},
		success: function(res) {
			if (res.code == 1000) {
				discBK(res);
			} else {
			}
		},
		error: function(err) {
			$.console.error(err);
		}
	})
}

function discBK(data) {
	var discs = data.hot_discussions;
	var $c = $("#ask-list");
	for(var i in discs) {
		var $e = $('\
		<li class="clearfix" data-id="' + discs[i].id + '">\
			<a class="label" href="">'+ discs[i].course_name +'\
			</a>\
			<i>•</i>\
			<a target="_blank" href="" data-track="syrmsj-1-2" class="text">' + discs[i].content  + '</a>\
		</li>\
		');
		$c.append($e);
	}
}

////////////////////////////////////////////////
//                 热门笔记                    //
///////////////////////////////////////////////

$(function() {
	// ajax获取课程信息
	createNotes();
})
function createNotes() {
	$.ajax({
		url: ROOT + 'newest_note/',
		type: 'POST',
		data: {
			page: 1,
			limit: 8
		},
		dataType: 'JSON',
		crossDomain: true,
		xhrFields: {
			withCredentials: true
		},
		success: function(res) {
			if (res.code == 1000) {
				noteBK(res);
			} else {
			}
		},
		error: function(err) {
			$.console.error(err);
		}
	})
}
function noteBK(data) {
	var notes = data.notes;
	console.log(notes);
	var $c = $("#note-list");
	for(var i in notes) {
		var $e = $('\
		<li class="clearfix" data-id="' + notes[i].id + '">\
			<a class="label" href="">'+ notes[i].title +'\
			</a>\
			<i>•</i>\
			<a target="_blank" href="" data-track="syrmsj-1-2" class="text">' + notes[i].content  + '</a>\
		</li>\
		');
		$c.append($e);
	}
}

// 监听搜索
$(function() {
	$("#search-form").on("submit", function() {
		window.location = '/view/courses.html?course_name=' + encodeURI($('#search-input').val());
		return false;
	})
})

// 设置浮动标签
function setLabelCourse(data) {
	var floatPane = $("#flow_tag_widget");
	for(var i in data) {
		var label = $('\
  		  <a class="item btn btn-primary" title="精品课程" href="/view/lesson.html?chapter_index=1&lesson_index=1&course_id=' + data[i].id + '">' + data[i].name + '</a>\
		')
		floatPane.append(label);
	}
	setupTag();
}
