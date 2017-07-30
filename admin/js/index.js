var ROOT = 'http://115.159.188.200:8000/'

$(function() {
	// 获取用户总数
	var uCount = $("#u-count");
	var uOk, cOk;
	uOk = cOk = false;
	$.ajax({
		url: ROOT + 'get_my_staffs/',
		type: "POST",
		crossDomain: true,
		//下面2个参数用于解决跨域问题
		xhrFields: {
			withCredentials: true
		},
		success: function(res) {
			uCount.text(res.cnt)
			uOk = true;
			setVisit();
		}
	})
	// 获取课程总数
	var cCount = $("#c-count");
	$.ajax({
		url: ROOT + 'get_all_courses/',
		type: "POST",
		crossDomain: true,
		//下面2个参数用于解决跨域问题
		xhrFields: {
			withCredentials: true
		},
		success: function(res) {
			cCount.text(res.cnt)
			cOk = true;
			setVisit();
		}
	})

	function setVisit() {
		if (uOk && cOk) {
			var vCount = $("#v-count");
			vCount.text(cCount.text() * uCount.text() * 2);
		} else {
			return false;
		}
	}
})

// 活跃用户
$(function() {
	// var uActive = $("#u-active");	
})
