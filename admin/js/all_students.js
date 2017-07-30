var EditableTable = function () {

    return {

        //main function to initiate the module
        init: function () {
            //连接服务器动态生成学员信息表格
            $.ajax({
                type: "POST",
                url: "http://115.159.188.200:8000/get_my_staffs/",
                data: "limit=100&page=1",
                dataType: "json",
                async: false,
                //下面2个参数用于解决跨域问题
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function(data){
                    console.log("获取学员信息：");
                    console.log(data);
                    if(data.code==1000){
                        for (var i in data.staffs) {
                            var st = data.staffs[i];
                            var $cou= $('<tr></tr>');
                            $cou.append($('<td></td>',{class: "course-id",html:st.mail}));
                            $cou.append($('<td></td>',{class: "course-name",html:st.name}));
                            $cou.append($('<td></td>',{class: "course-category",html:st.department_name}));
                            $cou.append($('<td></td>',{class: "course-introduce",html:st.phone}));
                            $cou.append($('<td></td>',{class: "course-departments",html:"学员权限（尚未接入）"}));
                            // $cou.append($('<td></td>',{html:data.courses[i].demaprtment}));
                            $cou.append('<td><a class="show" href="/admin/profile.html?stu_id=' + st.id  + '">查看</a></td>');
                            $('tbody').append($cou);
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
                // oTable.fnUpdate('<a class="edit" href="">修改</a>', nRow, 5, false);
                oTable.fnUpdate('<a class="show" href="/admin/profile.html' + data.courses[i].id  + '">查看</a>', nRow, 6, false);
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

            $('#editable-sample_wrapper .dataTables_filter input').addClass("form-control medium"); // modify table search input
            $('#editable-sample_wrapper .dataTables_length select').addClass("form-control xsmall"); // modify table per page dropdown

            var nEditing = null;

            $('#editable-sample a.cancel').live('click', function (e) {
                e.preventDefault();
                if ($(this).attr("data-mode") == "new") {
                    var nRow = $(this).parents('tr')[0];
                    oTable.fnshowRow(nRow);
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

var ROOT = 'http://115.159.188.200:8000/'
// 导出excel以及打印功能
$(function() {
    $("#export").click(function() {
        $.ajax({
            url: ROOT + 'export_user_info/',
            crossDomain: true,
            //下面2个参数用于解决跨域问题
            xhrFields: {
                withCredentials: true
            },
            success: function(res) {
                var url = res.url;
                var $form = $("<form action='" + ROOT + url + "'></form>")
                $form.trigger("submit");
            }
        })
    })

    $("#print").click(function() {
       bdhtml=window.document.body.innerHTML;
       sprnstr="<!--startprint-->";   
       eprnstr="<!--endprint-->";
       prnhtml=bdhtml.substr(bdhtml.indexOf(sprnstr)+17);
       prnhtml=prnhtml.substring(0,prnhtml.indexOf(eprnstr));
       window.document.body.innerHTML=prnhtml;
       window.print();
    })
})
