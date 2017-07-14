var EditableTable = function () {

    return {

        //main function to initiate the module
        init: function () {

            //连接服务器动态生成部门表格
            $.ajax({
                type: "POST",
                url: "http://115.159.188.200:8000/get_department/",
                data: "",
                dataType: "json",
                async: false,
                //下面2个参数用于解决跨域问题  
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function(data){
                    console.log("获取部门：");
                    console.log(data);
                    if(data.code==1000){
                        for (var i = 0; i < data.departments.length; i++) {
                            var $cou= $('<tr></tr>');
                            $cou.append($('<td></td>',{class: "department-id",html:data.departments[i].id}));
                            $cou.append($('<td></td>',{class: "department-name",html:data.departments[i].name}));
                            $cou.append('<td>不可修改</td><td><a class="delete" href="javascript:;">删除</a></td>');
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
                jqTds[0].innerHTML = '自动生成id(不需填写)';
                jqTds[1].innerHTML = '<input type="text" class="form-control small" value="' + aData[1] + '">';
                jqTds[2].innerHTML = '<a class="edit" href="">保存</a>';
                jqTds[3].innerHTML = '<a class="cancel" href="">取消</a>';
            }

            function saveRow(oTable, nRow) {
                var jqInputs = $('input', nRow);
                oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
                oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
                oTable.fnUpdate('不可修改', nRow, 2, false);
                oTable.fnUpdate('<a class="delete" href="">删除</a>', nRow, 3, false);
                oTable.fnDraw();
            }

            function cancelEditRow(oTable, nRow) {
                var jqInputs = $('input', nRow);
                oTable.fnUpdate(jqInputs[0].value, nRow, 1, false);
                oTable.fnUpdate('<a class="edit" href="">Edit</a>', nRow, 2, false);
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

            $('#editable-sample_new').click(function (e) {
                e.preventDefault();
                var aiNew = oTable.fnAddData(['', '', 
                        '<a class="edit" href="">保存</a>', '<a class="cancel" data-mode="new" href="">取消</a>'
                ]);
                var nRow = oTable.fnGetNodes(aiNew[0]);
                editRow(oTable, nRow);
                nEditing = nRow;
            });

            $('#editable-sample a.delete').live('click', function (e) {
                e.preventDefault();

                var f = confirm("确定要删除此部门吗 ?");
                if (f == false) {
                    return;
                }

                var delDepId = $(this).parent().prev().prev().prev().text();
                
                var flag = false;
                //连接服务器删除
                $.ajax({
                        type: "POST",
                        url: "http://115.159.188.200:8000/del_department/",
                        data: "department_id="+delDepId,
                        dataType: "json",
                        async: false,
                        //下面2个参数用于解决跨域问题  
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true,
                        success: function(data){
                            console.log("删除部门：");
                            console.log(data);
                            if(data.code==1000){
                                flag=true;
                            }else if(data.code==1001){
                                window.alert("您尚未登录。");
                            }else if(data.code==1002){
                                window.alert("您不是管理员，没有此权限。");
                            }else if(data.code==1003){
                                window.alert("部门内尚有课程，不可删除。");
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
                }

            });

            $('#editable-sample a.cancel').live('click', function (e) {
                e.preventDefault();
                var nRow = $(this).parents('tr')[0];
                    oTable.fnDeleteRow(nRow);
            });

            $('#editable-sample a.edit').live('click', function (e) {
                e.preventDefault();

                var newDepName = $(this).parent().prev().find('input').val();

                //连接服务器提交
                $.ajax({
                        type: "POST",
                        url: "http://115.159.188.200:8000/add_department/",
                        data: "department_name="+newDepName,
                        dataType: "json",
                        async: false,
                        //下面2个参数用于解决跨域问题  
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true,
                        success: function(data){
                            console.log("添加部门：");
                            console.log(data);
                            if(data.code==1000){
                                window.location.reload();//刷新当前页面
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

            });
        }

    };

}();