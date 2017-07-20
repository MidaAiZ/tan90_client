$(document).ready(function() {
    STUID = location.search.substr(8);
	initInfo();
	initCourse();
})

function initInfo() {
	$.ajax({
        type: "POST",
        url: "", // 获取学生基本信息
        dataType: "json",
        async: false,
        //下面2个参数用于解决跨域问题
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data) {
            // setInfo(data);
        },
        error: function(err) {
            // location = window.history
        }
    })
}

function initCourse() {

}
var iSelec = {
    avatar: ".profile-pic img",
    infoPane: "#u-info-pane",
    number: "#u-number",
    name: "#u-name",
    depart: "#u-depart",
    gender: "#u-gender",
    addr: "#u-addr",
    intro: "#u-intro",
    coursePane: "#course-pane"
}

function setInfo(data) {
    var user = data.user
    var $avatar = $(iSelec.avatar);
    var $infoPane = $(iSelec.infoPane);
    var $number = $infoPane.find(iSelec.number)
    var $name = $infoPane.find(iSelec.name)
    var $depart = $infoPane.find(iSelec.depart)
    var $gender = $infoPane.find(iSelec.gender)
    var $addr = $infoPane.find(iSelec.addr)

    var $intro = $(iSelec.intro);
    var $coursePane = $(iSelec.coursePane);

    $avatar.attr("src", user.face)
    $number.html(user.number)
    $name.html(user.name)
    $depart.html(user.department)
    $gender.html(user.gender)
    $addr.html(user.address)
    $intro.html($user.introduce)
}

function setCourse(data) {
	// 显示学员课程信息
}
