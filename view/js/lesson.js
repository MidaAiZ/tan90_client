$(function() {
    //视频插件加载
    var flashvars={
        p:0,
        e:1,
        i:'http://www.ckplayer.com/static/images/cqdw.jpg'
    };
    var video=['http://img.ksbbs.com/asset/Mon_1605/0ec8cc80112a2d6.mp4->video/mp4'];
    var support=['all'];
    CKobject.embedHTML5('a1','ckplayer_a1',650,433,video,flashvars,support);

    //自动生成讨论区回复
    for (var i = 0; i < 4; i++) {
        // var $parentDiv = $('<div />',{class: 'answer-con first '+i});

        var $quesAnsw = $('<div />',{class: 'ques-answer num'+i});
        var $parentDiv = $('<div />',{class: 'answer-con first'});
        var $headPic = $('<div />',{class: 'user-pic',
                                    html:'<img src="http://img.mukewang.com/58cf458000016d7302000200-100-100.jpg" width="40" height="40" alt="?">'});
        var $quesUser = $('<div />',{class: 'detail-r',
                                    html:'<span class="time">22小时前</span>'+
                                '<a class="detail-name" href="/u/3118245/bbs" target="_blank">书旅</a>'+
                                '<p class="detail-signal">职务</p>'})
        var $quesCon = $('<div />',{class: 'ques-content rich-text aimgPreview',
                                    html:'<p>JAVA环境怎么搭建？</p>'});
        var $answCon = $('<div />',{class:'answer-content rich-text aimgPreview ctrl-bar'});
        $answCon.append('<span data-replynum="0" data-ques-uid="1915727"><em>2</em>个回复：</span>'+
                        '<p>回复者1：回复内容</p>'+
                        '<p>回复者2：回复内容</p>');
        $answCon.append('<input type="text" name="user_search" placeholder="请输入回复内容" />'+
                        '<span class="reply">回复</span>');
        $("#discussion").append($quesAnsw);
        $quesAnsw.append($parentDiv);
        $parentDiv.append($headPic);
        $parentDiv.append($quesUser);
        $parentDiv.append($quesCon);
        $parentDiv.append($answCon);
    };

    //侧边栏js
    $('.menu , .linee').on('click', function() {
        $('.menu').toggleClass('over')
        $('.linea1').toggleClass('overL1')
        $('.linea2').toggleClass('overL2')
        $('.linea3').toggleClass('overL3')
        $('.main-menu').toggleClass('overmain')
    });  

    //滚动条js
    (function($){
        $(window).load(function(){
            $("#content1").mCustomScrollbar({
                autoHideScrollbar:true,
                theme:"light-thin"
            });
        });
    })(jQuery);     
});
