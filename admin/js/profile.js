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

// 图表
$(function() {
    var chart = c3.generate({

        bindto: '#chart',

        data: {
            columns: [
                ['开始时间', 19.33, 12.13, 8.01, 20.24, 12.03, 9.21, 18.22, 12.09],
                ['结束时间', 19.37, 12.38, 8.18, 20.45, 12.19, 9.35, 18.32, 12.12]
            ],
            types: {
                data1: 'line',
                data2: 'line'
            }
        },

        axis: {
            x: {
                type: 'categorized'
            }
        }

    });
});

// 打印信息
$(function() {
    $("#print").click(function() {
        bdhtml = window.document.body.innerHTML;
        sprnstr = "<!--startprint-->";
        eprnstr = "<!--endprint-->";
        prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 17);
        prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr));
        window.document.body.innerHTML = prnhtml;
        window.print();
    })
})
