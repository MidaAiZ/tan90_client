

//获取参数方法
function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  decodeURI(r[2]); return null;
}

var EditableTable = function () {

    return {

        //main function to initiate the module
        init: function () {

            var chapname = "";
            var secname = "";
            var t=0;

            //连接服务器动态生成课程资料表格
            $.ajax({
                type: "POST",
                url: "http://115.159.188.200:8000/get_chapter/",
                data: "id="+GetQueryString("course_id"),
                dataType: "json",
                async: false,
                //下面2个参数用于解决跨域问题  
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function(data){
                    console.log("获取章：");
                    console.log(data);
                    if(data.code==1000){
                        for (var i = 0; i < data.chapters.length; i++) {
                            chapname = data.chapters[i].name;
                            $.ajax({
                                type: "POST",
                                url: "http://115.159.188.200:8000/get_section/",
                                data: "chapter_id="+data.chapters[i].id,
                                dataType: "json",
                                async: false,
                                //下面2个参数用于解决跨域问题  
                                xhrFields: {
                                    withCredentials: true
                                },
                                crossDomain: true,
                                success: function(data){
                                    console.log("获取节：");
                                    console.log(data);
                                    if(data.code==1000){
                                        for (var i = 0; i < data.sections.length; i++) {
                                            secname = data.sections[i].name;
                                            $.ajax({
                                                type: "POST",
                                                url: "http://115.159.188.200:8000/get_content/",
                                                data: "section_id="+data.sections[i].id,
                                                dataType: "json",
                                                async: false,
                                                //下面2个参数用于解决跨域问题  
                                                xhrFields: {
                                                    withCredentials: true
                                                },
                                                crossDomain: true,
                                                success: function(data){
                                                    console.log("获取内容：");
                                                    console.log(data);
                                                    if(data.code==1000){
                                                        
                                                        for (var i = 0; i < data.contents.length; i++) {
                                                            t++;
                                                            var $con= $('<tr></tr>');
                                                            $con.append($('<td></td>',{style: '',class: "content-id",html:t}));
                                                            $con.append($('<td></td>',{style: '',class: "content-name",html:data.contents[i].name}));
                                                            $con.append($('<td></td>',{style: '',class: "chapter-name",html:chapname}));
                                                            $con.append($('<td></td>',{style: '',class: "section-name",html:secname}));

                                                            if(data.contents[i].type=="V"){
                                                                $con.append($('<td></td>',{style: '',class: "type",html:"视频"}));
                                                            }else if(data.contents[i].type=="A"){
                                                                $con.append($('<td></td>',{style: '',class: "type",html:"音频"}));
                                                            }else if(data.contents[i].type=="P"){
                                                                $con.append($('<td></td>',{style: '',class: "type",html:"文档"}));
                                                            }

                                                            $con.append($('<td></td>',{style: '',class: "detail",html:'<a href="'+'http://115.159.188.200:8000'+data.contents[i].url+'">查看</a>'}));
                                                            $con.append('<td style=""><a class="edit" href="javascript:;">修改</a></td><td style="width:6%"><a class="delete" href="javascript:;">删除</a></td>');
                                                            $('tbody').append($con);
                                                        };
                                                    }else if(data.code==1001){
                                                        window.alert("您尚未登录。");
                                                    }else{
                                                        window.alert(data.msg);
                                                    }
                                                },
                                                error: function(XMLHttpRequest, textStatus, errorThrown) {
                                                    window.alert(textStatus);
                                                }
                                            });
                                        };
                                    }else if(data.code==1001){
                                        window.alert("您尚未登录。");
                                    }else{
                                        window.alert(data.msg);
                                    }
                                },
                                error: function(XMLHttpRequest, textStatus, errorThrown) {
                                    window.alert(textStatus);
                                }
                            });

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

            function restoreRow(oTable, nRow) {
                var aData = oTable.fnGetData(nRow);
                var jqTds = $('>td', nRow);

                for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
                    oTable.fnUpdate(aData[i], nRow, i, false);
                }

                oTable.fnDraw();
            }

            function editRow(oTable, nRow) {
                var aData = oTable.fnGetData(nRow);
                var jqTds = $('>td', nRow);
                jqTds[0].innerHTML = '<input type="text" class="form-control small" value="' + aData[0] + '">';
                jqTds[1].innerHTML = '<input type="text" class="form-control small" value="' + aData[1] + '">';
                jqTds[2].innerHTML = '<input type="text" class="form-control small" value="' + aData[2] + '">';
                jqTds[3].innerHTML = '<input type="text" class="form-control small" value="' + aData[3] + '">';
                jqTds[4].innerHTML = '<input type="text" class="form-control small" value="' + aData[4] + '">';
                jqTds[5].innerHTML = '<a class="edit" href="">保存</a>';
                jqTds[6].innerHTML = '<a class="cancel" href="">取消</a>';
            }

            function saveRow(oTable, nRow) {
                var jqInputs = $('input', nRow);
                oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
                oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
                oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
                oTable.fnUpdate(jqInputs[3].value, nRow, 3, false);
                oTable.fnUpdate(jqInputs[4].value, nRow, 4, false);
                oTable.fnUpdate('<a class="edit" href="">修改</a>', nRow, 5, false);
                oTable.fnUpdate('<a class="delete" href="">删除</a>', nRow, 6, false);
                oTable.fnDraw();
            }

            function cancelEditRow(oTable, nRow) {
                var jqInputs = $('input', nRow);
                oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
                oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
                oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
                oTable.fnUpdate(jqInputs[3].value, nRow, 3, false);
                oTable.fnUpdate('<a class="edit" href="">Edit</a>', nRow, 4, false);
                oTable.fnDraw();
            }

            var oTable = $('#editable-sample').dataTable({
                "aLengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "All"] // change per page values here
                ],
                // set the initial value
                "iDisplayLength": 15,
                "sDom": "<'row'<'col-lg-6'l><'col-lg-6'f>r>t<'row'<'col-lg-6'i><'col-lg-6'p>>",
                "sPaginationType": "bootstrap",
                "oLanguage": {
                    "sLengthMenu": "_MENU_ 条记录/页",
                    "oPaginate": {
                        "sPrevious": "上一页",
                        "sNext": "下一页"
                    }
                }
                // "aoColumnDefs": [{
                //         'bSortable': false,
                //         'aTargets': [0]
                //     }
                // ]
            });

            jQuery('#editable-sample_wrapper .dataTables_filter input').addClass("form-control medium"); // modify table search input
            jQuery('#editable-sample_wrapper .dataTables_length select').addClass("form-control xsmall"); // modify table per page dropdown

            var nEditing = null;

            $('#editable-sample a.delete').live('click', function (e) {
                e.preventDefault();

                var f = window.confirm("确定要删除此课程资料么?");

                if (f == false) {
                    return;
                }

                console.log($(this).parent().parent().find(".course-name").text());

                // var nRow = $(this).parents('tr')[0];
                // oTable.fnDeleteRow(nRow);
                // window.alert("删除成功");
                var flag = false;

                $.ajax({
                    type: "POST",
                    url: "http://115.159.188.200:8000/delete_course/",
                    data: "course_name="+$(this).parent().parent().find(".course-name").text(),
                    dataType: "json",
                    async: false,
                    //下面2个参数用于解决跨域问题  
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success: function(data){
                        console.log("删除课程：");
                        console.log(data);
                        if(data.code==1000){
                            flag=true;
                        }else if(data.code==1001){
                            window.alert("您尚未登录。");
                        }else if(data.code==1002){
                            window.alert("您不是管理员，没有此权限。");
                        }else if(data.code==1003){
                            window.alert("不存在此门课程，请刷新页面。");
                        }else{
                            window.alert(data.msg);
                        }
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        window.alert(textStatus);
                    }
                });

                if(flag==true){
                    var nRow = $(this).parents('tr')[0];
                    oTable.fnDeleteRow(nRow);
                    window.alert("删除课程成功");
                }
                
            });

            $('#editable-sample a.cancel').live('click', function (e) {
                e.preventDefault();
                if ($(this).attr("data-mode") == "new") {
                    var nRow = $(this).parents('tr')[0];
                    oTable.fnDeleteRow(nRow);
                } else {
                    restoreRow(oTable, nEditing);
                    nEditing = null;
                }
            });

            $('#editable-sample a.edit').live('click', function (e) {
                e.preventDefault();

                /* Get the row as a parent of the link that was clicked on */
                var nRow = $(this).parents('tr')[0];

                url="modify_course.html?course_id="+$(this).parent().parent().find(".course-id").text()+
                                        "&course_name="+$(this).parent().parent().find(".course-name").text()+
                                        "&course_introduce="+$(this).parent().parent().find(".course-introduce").text();
                url=encodeURI(url);

                if (nEditing !== null && nEditing != nRow) {
                    /* Currently editing - but not this row - restore the old before continuing to edit mode */
                    restoreRow(oTable, nEditing);
                    //跳转到修改页面
                    window.location.href=url;
                    //editRow(oTable, nRow);
                    nEditing = nRow;
                } else if (nEditing == nRow && this.innerHTML == "保存") {
                    /* Editing this row and want to save it */
                    saveRow(oTable, nEditing);
                    nEditing = null;
                    alert("Updated! Do not forget to do some ajax to sync with backend :)");
                } else {
                    /* No edit in progress - let's start one */
                    //跳转到修改页面
                    window.location.href=url;
                    //editRow(oTable, nRow);
                    nEditing = nRow;
                }
            });
        }

    };

}();

