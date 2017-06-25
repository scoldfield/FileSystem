var controller = $('#page').attr('data-url');

function loadRenderWin(_url, _title, _width, _height, _hidemenu,_fn){
    var hidemenu = _hidemenu || false;
    ymPrompt.win({message: '<div class="g-ympromtwrap j-classdealwrap"></div>', width: _width, height: _height, title: _title, showMask: true,maskAlpha: 0.6});
    var $classdealwrap = $('.j-classdealwrap');
    $classdealwrap.load(_url);
    /* 是否隐藏二级菜单 */
    if(hidemenu){
        $classdealwrap.addClass('ym-hidemenu');
    }
    if(_fn){_fn();}
}

function resizeYmprompt(){
    $('.ym-body,#ym-window').css({'overflow':'visible','overflow-y':'visible'});
}

function delYmpromptWin(width, height, url, type){
    var _width = width || 560, _height = height || 230, _url = url || false, _type = type || false;
    var msg;
    switch(_type){
        case 'role':
            msg = '<p>删除角色同时删除和角色相关的权限。</p><p>是否继续删除？</p>';
            break;
        case 'class':
            msg = '<p>删除班级将同时删除和班级相关的用户信息。</p><p>是否继续删除？</p>';
            break;
        case 'grade':
            msg = '<p>删除年级将同时删除年级包含的班级和用户信息。</p><p>是否继续删除？</p>';
            break;
        case 'teacher':
            msg = '<p>删除用户帐号后该用户将无法登陆。</p><p>是否继续删除？</p>';
            break;
        case 'school':
            msg = '<p>确认删除该条信息吗？</p>';
            break;
        case 'schooladmin':
            msg = '<p>删除学校帐号信息将同时删除与其相关的所有信息。</p><p>是否继续删除？</p>';
            break;
        case 'admin':
            msg = '<p>删除管理员信息后该帐号将无法登录。</p><p>是否继续删除？</p>';
            break;
        case 'comment':
            msg = '<p>是否删除选中的学生点评信息。</p><p>是否继续删除？</p>';
            break;
        case 'deaftJump':
            msg = '<p>是否删除草稿箱的作业信息。</p><p>是否继续删除？</p>';
            break;
        case 'version':
            msg = '<p>是否继续删除该版本的信息？</p>';
            break;
        default :
            msg = '<p>是否继续删除选中记录？</p>';
            break;
    }

    ymPrompt.win({
        message: '<div class="m-delalert">' + msg + '<div class="del-deal"><a class="comfirmdel">确定</a><a class="cancel">取消</a></div></div>',
        width: _width,
        height: _height,
        titleBar: false,
        showMask: true
    });
    $('.m-delalert .cancel').bind('click', function(){
        ymPrompt.close();
        $('.m-delalert .comfirmdel').unbind('click');
    });
    $('.m-delalert .comfirmdel').bind('click',function(){
        if(_url && _type){
            $.ajax({
                url: _url,
                dataType: "json",
                success: function(da){
                    if(da.result=="1"){
                        ymPrompt.win({message: "<div class='success'>删除成功！</div>",width: 600, height:170,msgCls:'myContent',title:'系统提示',showMask: true,showShadow:true});
                        setTimeout(function(){
                            ymPrompt.close();
                            window.location.href = type;
                        },2000)
                    }else if(da.result=="0"){
                        ymPrompt.win({message:'<div class="error">操作失败！返回列表</div>', width: 600, height:170,msgCls:'myContent',title:'系统提示',showMask: true,showShadow:true});
                         setTimeout(function(){
                            ymPrompt.close();
                            window.location.href = type;
                        },2000)
                    }else if(da.result=="20"){
                        ymPrompt.win({message: "<div class='error'>该班级有对应的教师，请先解除教师与班级关系！</div>",width: 600, height:170,msgCls:'myContent',title:'系统提示',showMask: true,showShadow:true });
                        setTimeout(function(){
                            ymPrompt.close();
                            window.location.href = type;
                        },2000)
                    	
                    }else if(da.result=="21"){
                        ymPrompt.win({message: "<div class='error'>该年级下有对应的教师，请先解除教师与班级关系！</div>",width: 600, height:170,msgCls:'myContent',title:'系统提示',showMask: true,showShadow:true });
                        setTimeout(function(){
                            ymPrompt.close();
                            window.location.href = type;
                        },2000)
                    	
                    }else if(da.result=="22"){
                    	ymPrompt.win({message: "<div class='error'>该角色有对应的教师，请先解除教师与角色关系！</div>",width: 600, height:170,msgCls:'myContent',title:'系统提示',showMask: true,showShadow:true});
                    	setTimeout(function(){
                            ymPrompt.close();
                            window.location.href = type;
                        },2000) 	
                    }
                }
            });
        }else if(document.getElementById("deleteAction")){
            var _deleteAction = document.getElementById("deleteAction");
            _deleteAction.action = controller + "/delete";
            _deleteAction.method = "post";
            _deleteAction.submit();
        }
    });
}
var newWinInfo = function(title, str){
	ymPrompt.win({
		message:"<p style='margin:5px 10px;padding:5px 5px 30px;line-height:28px;letter-spacing:1px;'>"+str+"</p>" ,
		width:360,
		height:420,
		title:title,
		showMask: true
	});
}

function del(_url, type){
    $.ajax({
        url: _url,
        dataType: "json",
        success: function(da){
            if(da.result){
            	ymPrompt.win({message: '<div class="success">删除成功！</div>', width: 600, height:170,msgCls:'myContent',title:'系统提示',showMask: true,showShadow:true})
            	setTimeout(function() { 
            		 ymPrompt.close();
            		 window.location.href = type;
            	}, 2000);     
                
            }
        }
    });
}


function update(_title, _isYmprompt, _w, _h, _hidememu){
    var isYmprompt = _isYmprompt || false;
    var hidememu = _hidememu || false;
    var context = document.getElementById("context").value;
    var roleid = document.getElementsByName("idList");
    var update = -1;
    var flag = 0;
    for(var i = 0; i < roleid.length; i++){
        if(roleid[i].checked == true){
            flag++;
            if(flag > 1){
                ymPrompt.alert({message: "只能选择一条记录进行修改", title: "修改"});
                return;
            }
            update = roleid[i].value;
        }
    }
    if(flag == 0){
        ymPrompt.alert({message: "请选择一条记录进行修改", title: "修改"});
        return;
    }
    if(isYmprompt){
        var url = context + '/' + controller + '/' + update + '/update.html';
        loadRenderWin(url, _title, _w, _h, hidememu);
    }else{
        window.location.href = context + '/' + controller + '/'
            + update + '/update';
    }
}

function selectall(){
    for(i = 0; i < document.getElementsByName("idList").length; i++){
        document.getElementsByName("idList")[i].checked = "checked";
    }
}
function selectno(){
    for(i = 0; i < document.getElementsByName("idList").length; i++){
        document.getElementsByName("idList")[i].checked = false;
    }
}
function deleteData(){
    var roleid = document.getElementsByName("idList");
    var flag = 0;
    for(var i = 0; i < roleid.length; i++){
        if(roleid[i].checked == true)
            flag++;
    }
    if(flag == 0){
        ymPrompt.alert({title: '删除', message: '请选择一条记录进行删除'});
        return;
    }
    delYmpromptWin(400, 185, false, false);
}

function dlist(){
    var pageNum = document.getElementById("pageNum").value;
    var pageSize = document.getElementById("pageSize").value;
    document.getElementById("deleteAction").action = controller + "/listAll?pageNumber=" + pageNum + "&itemsOnPage=" + pageSize;
    document.getElementById("deleteAction").method = "GET";
    document.getElementById("deleteAction").submit();
}

//进入页面加载第一页
/*$(function(){
    if($('#itemsOnPage').val() != null && $('#itemsOnPage').val() != 0){
        $('#itemsOnPage').val(parseInt($('#pageSize').val()));
    }
    var itemsOnPage = $('#itemsOnPage').val();
    var pageCount = $('#pageCount').val();
    var pageNumber = parseInt($('#pageNum').val());
    $('#adressbookPage').pagination({
        items: pageCount,
        itemsOnPage: itemsOnPage,
        cssStyle: 'compact-theme',
        currentPage: pageNumber,
        onPageClick: function(pageNumber, event){
            //跳转链接
            //alert("itemsOnPage:"+itemsOnPage+" pageNumber:"+pageNumber);
            window.location.href = controller + "?pageNumber=" + pageNumber + "&itemsOnPage=" + itemsOnPage;
        }
    });
    $('#itemsOnPage').change(function(){
        var itemsOnPage = $('#itemsOnPage').val();
        window.location.href = controller + "?pageNumber=1&itemsOnPage=" + itemsOnPage;
    });
    $('#position').click(function(){
        var itemsOnPage = $('#itemsOnPage').val();
        var pageNumber = $('#turnTo').val();
        window.location.href = controller + "?pageNumber=" + pageNumber + "&itemsOnPage=" + itemsOnPage;
    });

});*/

//-------------------------------------------------------------- 考试模块 ---------------------------------------------------
//查看考试分页
var getPageExamToview = function(options){
    var stime = $("#sTime").val();
    var etime = $("#eTime").val();
    var date, edate;
    if(stime != "" && stime != null){
        stime += " 00:00:00";
        stime = stime.replace(/-/g, "/");
        date = new Date(stime);
    }

    if(etime != "" && etime != null){
        etime += " 23:59:59";
        etime = etime.replace(/-/g, "/");
        edate = new Date(etime);
    }
    var parmester = {
        "content": $("#content").val(),
        "courseId": $("#course").val(),
        "examtypeId": $("#examtype").val(),
        "examstate": $("#examstate").val(),
        "pageNumber": options.pageNumber,
        "itemsOnPage": options.pageSize,
        "starttime": date,
        "endtime": edate
    };
    $.ajax({
        url: "examlistjson",
        data: parmester,
        dataType: "json",
        type: "post",
        success: function(da){
            var str = "<tr class='thread'>" +
                "<td width='60'><input type='checkbox' class='u-inputcheckbox all-selected'></td>" +
                "<td>考试类型</td>" +
                "<td>考试科目</td>" +
                "<td>考试时间</td>" +
                "<td width='320'>考试内容</td>" +
                "<td>考试状态</td>" +
                "<td>倒计时(天)</td>" +
                "<td>成绩是否录入</td>" +
                "</tr>";
            $(da.list).each(function(){
                str += "<tr><td><input type='checkbox' class='u-inputcheckbox tr-sel' name='examId' value='" + this.id + "'/></td><td>" + this.examtypeName + "</td><td>" + this.couseName + "</td><td>" +
                    this.examTime.replace(/\n/g,'<br>') + "</td><td><a class='w320 text-of' href='javascript:newWinInfo(\"考试内容\",\"" + this.content.replace(/\n/g, '<br>') + "\")'>" +
                    this.content + "</a></td><td>" +
                    this.examstatename + "</td><td>" +
                    this.datenum + "</td><td>";
                if(this.entername == '未录入'){
                    str += "<a href='javascript:void(0);' onclick='jumpImport(" + this.id + ");'>" + this.entername + "</a>";
                }else if(this.entername == '已录入'){
                    str += "<a href='javascript:void(0);' onclick='jumpScore(" + this.id + ");'>" + this.entername + "</a>";
                }else{
                    str += this.entername;
                }
                str += "</td></tr>";
            });
            $(options.returnPage).html(str);
            options.pageCount = da.total;
            //生成分页
            $('.tab-pagination').pagination({
                items: options.pageCount,
                itemsOnPage: options.pageSize,
                currentPage: options.pageNumber,
                onPageClick: function(page){
                    options.pageSize = page.pageSize;
                    options.pageNumber = page.pageNumber;
                    getPageExamToview(options)
                }
            });
        }
    });
}

//查看成绩查询分页
var getPageExamEntry = function(options){
    var classId = $("#classId").val();
    var courseId = $("#course").val();
    var examtype = $("#examtype").val();
    var parmester = {};
    parmester['classid'] = classId;
    parmester['courseId'] = courseId;
    parmester['examtypeId'] = examtype;
    parmester['pageNumber'] = options.pageNumber;
    parmester['itemsOnPage'] = options.pageSize;
    var stime = $("#sTime").val();

    var etime = $("#eTime").val();

    if(stime != "" && stime != null){
        stime += " 00:00:00";
        stime = stime.replace(/-/g, "/");
        var date = new Date(stime);
        parmester['starttime'] = date;
    }

    if(etime != "" && etime != null){
        etime += " 23:59:59";
        etime = etime.replace(/-/g, "/");
        var edate = new Date(etime);
        parmester['endtime'] = edate;
    }
    $.ajax({
        url: "examscoreJson",
        data: parmester,
        dataType: "json",
        type: "post",
        success: function(da){
            var str = "<tr class='thread'>" +
                "<td width='60'><input type='checkbox' class='u-inputcheckbox all-selected'></td>" +
                "<td>成绩单名称</td>" +
                "<td>班级</td>" +
                "<td>考试类型</td>" +
                "<td>考试时间</td>" +
                "<td>上传人</td>" +
                "<td>上传时间</td>" +
                "<td>操作</td>" +
                "</tr>";
            $(da.list).each(function(){
                str += "<tr><td><input type='checkbox' class='u-inputcheckbox tr-sel' name='examId' value='" + this.id + "'/></td><td>" + this.resname + "</td><td>" + this.className + "</td><td>" +
                    this.examtypeName + "</td><td>" +
                    this.examTime.replace(/\n/g,'<br>') + "</td><td>" +
                    this.enterPerson + "</td><td>" +
                    this.time + "</td><td><a class='tr-btn' onclick='ymPrompt.win({message:\"scoredetaillist.html?id=" + this.id+"&classId="+classId + "\",width:360,height:480,title:\"" + this.resname + "\",iframe:true,showMask: true})' >查看</a>&nbsp;&nbsp;&nbsp;<a class='tr-btn' href='javascript:void(0);' onclick='del(" + this.id + ");'>删除</a>&nbsp;&nbsp;&nbsp;<a class='tr-btn' href='javascript:void(0);' onclick='downloadExcel("+this.id+");' >下载</a></td></tr>";
            });
            $(options.returnPage).html(str);
            options.pageCount = da.total;
            //生成分页
            $('.tab-pagination').pagination({
                items: options.pageCount,
                itemsOnPage: options.pageSize,
                currentPage: options.pageNumber,
                onPageClick: function(page){
                    options.pageSize = page.pageSize;
                    options.pageNumber = page.pageNumber;
                    getPageExamEntry(options)
                }
            });
        }
    });
}

//考试草稿箱分页
var getPageExamDrafts = function(options){
    var parmester = {};
    parmester['pageNumber'] = options.pageNumber;
    parmester['itemsOnPage'] = options.pageSize;
    $.ajax({
        url: "draftlistjson",
        data: parmester,
        dataType: "json",
        type: "post",
        success: function(da){
            var str = "<tr class='thread'>" +
                "<td width='60'><input type='checkbox' class='u-inputcheckbox all-selected'></td>" +
                "<td>考试类型</td>" +
                "<td>考试科目</td>" +
                "<td>考试标题</td>" +
                "<td>考试时间</td>" +
                "<td width='200'>考试内容</td>" +
                "<td>考试对象</td>" +
                "<td>操作</td>" +
                "</tr>";
            $(da.list).each(function(){
                str += "<tr><td><input type='checkbox' class='u-inputcheckbox tr-sel' name='examId' value='" + this.id + "##" + this.classid + "'/></td><td>" + this.examtypeName + "</td><td>" + this.couseName + "</td><td>" +
                    this.title + "</td><td>" +
                    this.examTime.replace(/\n/g,'<br>') + "</td><td><span class='w200 text-of'>" +
                    this.content + "</span></td><td>" +
                    this.className + "</td><td><a class='tr-btn' href='updatedeaft?id=" + this.id + "'>修改</a>&nbsp;&nbsp;&nbsp;<a class='tr-btn' href='javascript:void(0);' onclick='del(" + this.id + ");'>删除</a></td></tr>";
            });
            $(options.returnPage).html(str);
            options.pageCount = da.total;
            //生成分页
            $('.tab-pagination').pagination({
                items: options.pageCount,
                itemsOnPage: options.pageSize,
                currentPage: options.pageNumber,
                onPageClick: function(page){
                    options.pageSize = page.pageSize;
                    options.pageNumber = page.pageNumber;
                    getPageExamDrafts(options)
                }
            });
        }
    });
}


//-------------------------------------------------------------- 通知模块 ---------------------------------------------------
//通知草稿箱分页
var getPageNoticeDrafts = function(options){
    var parmester = {};
    parmester['pageNumber'] = options.pageNumber;
    parmester['itemsOnPage'] = options.pageSize;
    $.ajax({
        url: "draftJson",
        data: parmester,
        dataType: "json",
        type: "post",
        success: function(da){
            var str = "<tr class='thread'>" +
                "<td width='60'><input type='checkbox' class='u-inputcheckbox all-selected'></td>" +
                "<td width='320'>通知内容</td>" +
                "<td>创建时间</td>" +
                "<td>接收人</td>" +
                "<td>操作</td>" +
                "</tr>";
            $(da.list).each(function(){
                var totalStr = 0;
                if(this.total > 0){
                    totalStr = "<a class='tr-btn' href='javascript:ymPrompt.win({message:\"personlist.html?id=" + this.id + "\",width:360,height:480,title:\"\",iframe:true,showMask: true})' >接收人</a>"
                }
                str += "<tr><td><input type='checkbox' class='u-inputcheckbox tr-sel' name='noticeId' value='" + this.id + "##" + this.total + "'/></td><td  width='320'><div class='text-of w320'>" + this.content + "</div></td><td>" + this.time + "</td><td>" + totalStr +
                    "</td><td><a class='tr-btn' href='updatedeaft?id=" + this.id + "'>修改</a>&nbsp;&nbsp;&nbsp;<a class='tr-btn' href='javascript:void(0);' onclick='del(" + this.id + ");'>删除</a></td></tr>";
            });
            $(options.returnPage).html(str);
            options.pageCount = da.total;
            //生成分页
            $('.tab-pagination').pagination({
                items: options.pageCount,
                itemsOnPage: options.pageSize,
                currentPage: options.pageNumber,
                onPageClick: function(page){
                    options.pageSize = page.pageSize;
                    options.pageNumber = page.pageNumber;
                    getPageNoticeDrafts(options)
                }
            });

        }
    });
}
//已收通知分页
var getPageNoticeReceive = function(options){
    var content = $("#content").val();
    var parmester = {};
    parmester['content'] = content;
    parmester['pageNumber'] = options.pageNumber;
    parmester['itemsOnPage'] = options.pageSize;
    var stime = $("#sTime").val();

    var etime = $("#eTime").val();

    if(stime != "" && stime != null){
        stime += " 00:00:00";
        stime = stime.replace(/-/g, "/");
        var date = new Date(stime);
        parmester['starttime'] = date;
    }

    if(etime != "" && etime != null){
        etime += " 23:59:59";
        etime = etime.replace(/-/g, "/");
        var edate = new Date(etime);
        parmester['endtime'] = edate;
    }

    $.ajax({
        url: "receiveNoticeJson",
        data: parmester,
        dataType: "json",
        type: "post",
        success: function(da){
            var str = "<tr class='thread'>" +
                "<td width='60'><input type='checkbox' class='u-inputcheckbox all-selected'></td>" +
                "<td width='320'>通知内容</td>" +
                "<td>接收时间</td>" +
                "<td>发送人</td>" +
               // "<td>回复</td>" +
                "<td>转发</td>" +
                "</tr>";
            if(da.list.length == 0){
            	str +="<tr><td colspan='6' class='lh50'>您尚未收到相关通知！</td></tr>"
            }
            $(da.list).each(function(){
                var content = this.content;
                if(this.isread == "1"){
                    content = "<a href='javascript:void(0)' onclick='showContent(" + this.pId + "," + this.isread + ",\"" + this.content.replace(/\n/g, '<br>') + "\");' stlye='font-weight:bold;' class='text-of w320 noticeInfo'>" + this.content + "</a>";
                }else{
                    content = "<a href='javascript:void(0)' class='readed text-of w320 noticeInfo'  onclick='showContent(" + this.pId + "," + this.isread + ",\"" + this.content.replace(/\n/g, '<br>') + "\");'  >" + this.content + "</a>";
                }
                str += "<tr><td><input type='checkbox' class='u-inputcheckbox tr-sel' name='noticeId' value='" + this.pId + "'/></td><td  width='320'>" + content + "</td><td>" + this.time + "</td><td>" +
                    this.sendName + "</td><td><a class='tr-btn' href='updatedeaft?id=" + this.id + "&isAdd=true'>转发</a></td></tr>";
            });
            $(options.returnPage).html(str);
            options.pageCount = da.total;
            $('.table tr td .noticeInfo').unbind('click');
            $('.table tr td .noticeInfo').bind('click', function(){
                $(this).addClass('readed');
            });
            //生成分页
            $('.tab-pagination').pagination({
                items: options.pageCount,
                itemsOnPage: options.pageSize,
                currentPage: options.pageNumber,
                onPageClick: function(page){
                    options.pageSize = page.pageSize;
                    options.pageNumber = page.pageNumber;
                    getPageNoticeReceive(options)
                }
            });

        }
    });
}

//已发通知分页
var getPageNoticeSend = function(options){
    var content = $("#content").val();
    var parmester = {};
    parmester['content'] = content;
    parmester['pageNumber'] = options.pageNumber;
    parmester['itemsOnPage'] = options.pageSize;
    var stime = $("#sTime").val();

    var etime = $("#eTime").val();

    if(stime != "" && stime != null){
        stime += " 00:00:00";
        stime = stime.replace(/-/g, "/");
        var date = new Date(stime);
        parmester['starttime'] = date;
    }

    if(etime != "" && etime != null){
        etime += " 23:59:59";
        etime = etime.replace(/-/g, "/");
        var edate = new Date(etime);
        parmester['endtime'] = edate;
    }

    $.ajax({
        url: "sendNoticeJson",
        data: parmester,
        dataType: "json",
        type: "post",
        success: function(da){
            var str = "<tr class='thread'>" +
                "<td width='60'><input type='checkbox' class='u-inputcheckbox all-selected'></td>" +
                "<td width='320'>通知内容</td>" +
                "<td>发送时间</td>" +
                "<td>接收人数</td>" +
                "<td>接收人</td>" +
                "<td>转发</td>" +
                "</tr>";
            if(da.list.length == 0){
            	str +="<tr><td colspan='6' class='lh50'>您尚未发相关通知！</td></tr>"
            }
            $(da.list).each(function(){
                str += "<tr><td><input type='checkbox' class='u-inputcheckbox tr-sel' name='noticeId' value='" + this.id + "'/></td><td width='320'><a href='javascript:void(0)' class='text-of w320' onclick='showContent(\"" + this.content.replace(/\n/g, '<br>') + "\");' stlye='font-weight:bold;'>" + this.content + "</a></td><td>" + this.time + "</td><td>" +
                    this.total + "</td><td><a class='tr-btn' href='javascript:ymPrompt.win({message:\"personlist.html?id=" + this.id + "\",width:360,height:480,title:\"接收人\",iframe:true,showMask: true})' >接收人</a></td><td><a class='tr-btn' href='updatedeaft?id=" + this.id + "&isAdd=true'>转发</a></td></tr>";
            });
            $(options.returnPage).html(str);
            options.pageCount = da.total;
            //生成分页
            $('.tab-pagination').pagination({
                items: options.pageCount,
                itemsOnPage: options.pageSize,
                currentPage: options.pageNumber,
                onPageClick: function(page){
                    options.pageSize = page.pageSize;
                    options.pageNumber = page.pageNumber;
                    getPageNoticeSend(options)
                }
            });
            return da.list;
        }
    });
}
//---------------------------------------------------------通讯录----------------
var arg;
//通讯录学生管理分页
var getPageStudentBook = function(options){
    var path = $("#context").val();
    var classId = $("#classId").val();
    var parmester = {};
    parmester['classId'] = classId;
    parmester['stuname'] = $.trim($("#stuname").val());
    parmester['mobile'] = $.trim($("#mobile").val());
    parmester['pageNumber'] = options.pageNumber;
    parmester['itemsOnPage'] = options.pageSize;
    parmester['ordername'] = $.trim($("#ordername").val());
    $.ajax({
        url: path + "/phonebook/student/studentJson",
        data: parmester,
        dataType: "json",
        type: "post",
        success: function(da){
            console.log(da.list);
            var str = "<tr class='thread'>" +
            "<td>年级</td>" +
            "<td>班级</td>" +
               // "<td>学号<span class='icon-sort' data='1'></span></td>" +
                "<td>姓名<span class='icon-sort' data='3'></span></td>" +
                "<td>手机号码<span class='icon-sort' data='5'></span></td>" +
                "<td>性别<span class='icon-sort' data='7'></span></td>" +
                "</tr>";
            $(da.list).each(function(){
                str += "<tr><td>" + this.graname + "</td><td>" + this.classname + "</td><td>" + this.stuname + "</td><td>" + this.mobile + "</td><td>" +
                    this.sex + "</td></tr>";
            });
            $(options.returnPage).html(str);
            options.pageCount = da.total;
            $('.table tr td .icon-sort').unbind('click');
            $('.table tr td .icon-sort').bind('click', function(){
                $("#ordername").val(parseInt($(this).attr('data')) + parseInt($("#sort").val()));
                options.pageNumber = 1;
                getPageStudentBook(options);
                if($("#sort").val() == 0){
                    $("#sort").val(1);

                }else{
                    $("#sort").val(0);
                }
            });
            //生成分页
            $('.tab-pagination').pagination({
                items: options.pageCount,
                itemsOnPage: options.pageSize,
                currentPage: options.pageNumber,
                onPageClick: function(page){
                    options.pageSize = page.pageSize;
                    options.pageNumber = page.pageNumber;
                    getPageStudentBook(options);
                }
            });
        }
    });
}
//通讯录教师管理分页
var getPageTeacherBook = function(options){
    var path = $("#context").val();
    var parmester = {};
    parmester['username'] = $.trim($("#username").val());
    parmester['mobile'] = $.trim($("#mobile").val());
    parmester['pageNumber'] = options.pageNumber;
    parmester['itemsOnPage'] = options.pageSize;
    parmester['ordername'] = $.trim($("#ordername").val());
    $.ajax({
        url: path + "/phonebook/teacherBook/teacherJson",
        data: parmester,
        dataType: "json",
        type: "post",
        success: function(da){
            var str = "<tr class='thread'>" +
                "<td>教师姓名<span class='icon-sort' data='3'></span></td>" +
                "<td>手机号码<span class='icon-sort' data='5'></span></td>" +
                "<td>出生日期<span class='icon-sort' data='7'></span></td>" +
                "</tr>";
            $(da.list).each(function(){
                str += "<tr><td>" + this.name + "</td><td>" + this.mobile + "</td><td>" +
                    this.birthday + "</td></tr>";
            });
            $(options.returnPage).html(str);
            options.pageCount = da.total;
            $('.table tr td .icon-sort').unbind('click');
            $('.table tr td .icon-sort').bind('click', function(){
                $("#ordername").val(parseInt($(this).attr('data')) + parseInt($("#sort").val()));
                options.pageNumber = 1;
                getPageTeacherBook(options);
                if($("#sort").val() == 0){
                    $("#sort").val(1);

                }else{
                    $("#sort").val(0);
                }
            });
            //生成分页
            $('.tab-pagination').pagination({
                items: options.pageCount,
                itemsOnPage: options.pageSize,
                currentPage: options.pageNumber,
                onPageClick: function(page){
                    options.pageSize = page.pageSize;
                    options.pageNumber = page.pageNumber;
                    getPageTeacherBook(options);
                }
            });
        }
    });
}

//通讯录自定义群组管理分页

var getPageUsergrBoupook = function(options){
    var path = $("#context").val();
    var parmester = {};
    //parmester['username']=$.trim($("#username").val());
    parmester['name'] = $.trim($("#name").val());
    parmester['pageNumber'] = options.pageNumber;
    parmester['itemsOnPage'] = options.pageSize;

    $.ajax({
        url: path + "/phonebook/usergroup/grouplistJson",
        data: parmester,
        dataType: "json",
        type: "post",
        success: function(da){
            var str = "<tr class='thread'>" +
                "<td>编号</td>" +
                "<td>群组名称</td>" +
                "<td>创建人</td>" +
                "<td>创建时间</td>" +
                "<td>操作</td>" +
                "</tr>";
            $(da.list).each(function(){
                str += "<tr><td>" + this.id + "</td><td>" +
                    this.name + "</td><td>" +
                    this.createName + "</td><td>" +
                    this.time +
                    "</td><td><a class='tr-btn' onclick='ymPrompt.win({message:\"" + path + "/phonebook/usergroup/detail.html?id=" + this.id + "\",width:360,height:480,title:\"" + this.name + "\",iframe:true,showMask: true})' >查看</a>&nbsp;&nbsp;&nbsp;<a class='u-formShow tr-btn' data-type='edit' id='" + this.id + "' href='javascript:'>修改</a>&nbsp;&nbsp;&nbsp;<a class='tr-btn' href='javascript:void(0);' onclick='del(" + this.id + ");'>删除</a></td></tr>";
            });
            $(options.returnPage).html(str);
            options.pageCount = da.total;
            //生成分页
            $('.tab-pagination').pagination({
                items: options.pageCount,
                itemsOnPage: options.pageSize,
                currentPage: options.pageNumber,
                onPageClick: function(page){
                    options.pageSize = page.pageSize;
                    options.pageNumber = page.pageNumber;
                    getPageUsergrBoupook(options)
                }
            });
        }
    });
}
//-------------------------------------------------------作业模块--------------------------------
//今日作业分页
var getPageHomeworkToday = function(options){
    var cla = $("#cla").val();
    var course = $("#cou").val();
    var content = $("#content").val();
    var type = $("#type").val();
    var sort = $("#sort").val();
    var paramester = {};
    paramester['homework.classId'] = cla;
    paramester['homework.courseId'] = course;
    paramester['homework.content'] = content;
    paramester['types'] = type;
    paramester['sorts'] = sort;
    paramester['pageNumber'] = options.pageNumber;//第几页
    paramester['itemsOnPage'] = options.pageSize;//每页多少条
    $.ajax({
        url: $("#path").val() + "/homework/today",
        data: paramester,
        dataType: "json",
        type: "post",
        success: function(da){
            var str = "<tr class='thread'><td>作业日期<a href='javascript:void(0);' onclick='sorting(\"date\",1);'><span class='icon-sort'></span></a></td><td>科目<a href='javascript:void(0);' onclick='sorting(\"course\",1);'><span class='icon-sort'></span></a></td><td width='200'>内容</td><td>接收班级</td><td>发布人</td><td>发布时间<a href='javascript:void(0);' onclick='sorting(\"reldate\",1);'><span class='icon-sort'></span></a></td><td>有效时间<a href='javascript:void(0);' onclick='sorting(\"effdate\",1);'><span class='icon-sort'></span></a></td></tr>";
            $(da.list).each(function(){
                str += "<tr><td>" + this.createTimeStr
                    + "</td><td>" + this.courseName
                    + "</td><td width='200'><a class='w200 text-of' href='javascript:newWinInfo(\"作业内容\",\"" + this.content.replace(/\n/g, '<br>') + "\")'>" + this.content
                    + "</a></td><td><a href='javascript:ymPrompt.win({message:\"reciptine.html?id=" + this.id + "\",width:360,height:380,title:\"查看接收人\",iframe:true,showMask: true})'>" + (this.className.split(',').length - 1)
                    + "</a></td><td>"
                    + this.teacherName
                    + "</td><td>"
                    + this.createTimeString
                    + "</td><td>" + this.validtime
                    + "天</td></tr>";
            });
            $(options.returnPage).html(str);
            //总条数 da.total
            options.pageCount = da.total;
            console.log(options.pageCount);
            //生成分页
            $('.tab-pagination').pagination({
                items: options.pageCount,
                itemsOnPage: options.pageSize,
                currentPage: options.pageNumber,
                onPageClick: function(page){
                    options.pageSize = page.pageSize;
                    options.pageNumber = page.pageNumber;
                    getPageHomeworkToday(options)
                }
            });
        }
    });
}
//历史作业分页
var getPageHomeworkHistory = function(options){
    var publishtime = $("#publishtime").val();
    var cla = $("#class").val();
    var course = $("#course").val();
    var content = $("#content").val();
    var type = $("#type").val();
    var sort = $("#sort").val();
    var paramester = {};
    paramester['homework.classId'] = cla;
    paramester['homework.courseId'] = course;
    paramester['homework.content'] = content;
    paramester['types'] = type;
    paramester['sorts'] = sort;
    paramester['pageNumber'] = options.pageNumber;//第几页
    paramester['itemsOnPage'] = options.pageSize;//每页多少条
    paramester['time'] = publishtime;
    $.ajax({
        url: $("#path").val() + "/homework/selectHistory",
        data: paramester,
        dataType: "json",
        type: "post",
        success: function(da){
            var str = "<tr class='thread'><td>作业日期<a href='javascript:void(0);' onclick='sorting(\"date\",1);'><span class='icon-sort'></span></a></td><td>科目<a href='javascript:void(0);' onclick='sorting(\"course\",1);'><span class='icon-sort'></span></a></td><td>内容</td><td>接收班级</td><td>发布人</td><td>发布时间<a href='javascript:void(0);' onclick='sorting(\"reldate\",1);'><span class='icon-sort'></span></a></td><td>有效时间<a href='javascript:void(0);' onclick='sorting(\"effdate\",1);'><span class='icon-sort'></span></td></a></tr>";
            $(da.list).each(function(){
                str += "<tr><td>" + this.createTimeStr
                    + "</td><td>" + this.courseName
                    + "</td><td width='200'><a class='w200 text-of' href='javascript:newWinInfo(\"作业内容\",\"" + this.content.replace(/\n/g, '<br>') + "\")'>" + this.content
                    + "</a></td><td><a href='javascript:ymPrompt.win({message:\"reciptine.html?id=" + this.id + "\",width:360,height:380,title:\"查看接收人\",iframe:true,showMask: true})'>" + (this.className.split(',').length - 1)
                    + "</a></td><td>"
                    + this.teacherName
                    + "</td><td>"
                    + this.createTimeString
                    + "</td><td>" + this.validtime
                    + "天</td></tr>";
            });
            $(options.returnPage).html(str);
            //总条数 da.total
            options.pageCount = da.total;
            //生成分页
            $('.tab-pagination').pagination({
                items: options.pageCount,
                itemsOnPage: options.pageSize,
                currentPage: options.pageNumber,
                onPageClick: function(page){
                    options.pageSize = page.pageSize;
                    options.pageNumber = page.pageNumber;
                    getPageHomeworkHistory(options)
                }
            });
        }
    });
}
//作业草稿箱分页
var getPageHomeworkDraft = function(options){
    var paramester = {};
    paramester['pageNumber'] = options.pageNumber;//第几页
    paramester['itemsOnPage'] = options.pageSize;//每页多少条
    paramester['homework.pubstate'] = "1,2";
    $.ajax({
        url: $("#path").val() + "/homework/deaft",
        data: paramester,
        dataType: "json",
        type: "post",
        success: function(da){
            var str = "<tr class='thread'><td width='60'><input type='checkbox' name='idList' value='0' class='u-inputcheckbox all-selected'>全选</td><td width='240'>作业内容</td><td width='240'>创建时间</td><td>接收班级</td><td width='120'>完整性</td><td width='160'>修改</td></tr>";
            $(da.list).each(
                function(){
                    str += "<tr><td><input type='checkbox' name='idList' class='u-inputcheckbox tr-sel' value='" + this.id + "'></td><td><span class='w200 text-of'><a class='w200 text-of' href='javascript:newWinInfo(\"作业内容\",\"" + this.content.replace(/\n/g, '<br>') + "\")'>" + this.content + "</a></span></td><td>" + this.createTimeStr + "</td><td><a href='javascript:ymPrompt.win({message:\"reciptine.html?id=" + this.id + "\",width:360,height:380,title:\"查看接收人\",iframe:true,showMask: true})'>" + (this.className.split(',').length - 1) + "</a></td><td>";
                    if(this.complete == 1){
                        str += "否";
                    }else if(this.complete == 0){
                        str += "是";
                    }
                    var _url = "delFindOne?ids=" + this.id, _type = "deaftJump";
                    str += "</td><td><a href='javascript:' class='tr-btn' onclick='edit(" + this.id + ");'>修改</a><a href='javascript:delYmpromptWin(560,230,\"" + _url + "\",\"" + _type + "\");'>删除</a></td></tr>";
                });

            $(options.returnPage).html(str);
            //总条数 da.total
            options.pageCount = da.total;
            //生成分页
            $('.tab-pagination').pagination({
                items: options.pageCount,
                itemsOnPage: options.pageSize,
                currentPage: options.pageNumber,
                onPageClick: function(page){
                    options.pageSize = page.pageSize;
                    options.pageNumber = page.pageNumber;
                    getPageHomeworkDraft(options)
                }
            });
        }
    });
}

//-------------------------------------------------------学生点评模块---------------------------
//查看点评分页
var getPageCommentSelect = function(options){
    var path = $("#path").val();
    var start = $("#start").val();
    var end = $("#end").val();
    var content = $("#content").val();
    var parmester = {};
    parmester['start'] = start;
    parmester['end'] = end;
    parmester['content'] = content;
    parmester['pageNumber'] = options.pageNumber;
    parmester['itemsOnPage'] = options.pageSize;
    $.ajax({
        url: path + "/comment/select",
        data: parmester,
        dataType: "json",
        type: "post",
        success: function(da){
            var str = "<tr><td width='7%'><input type='checkbox' class='u-inputcheckbox all-selected' /></td><td width='320'>点评内容</td><td width='20%'>发送时间</td><td width='20%'>接受人数</td><td width='20%'>操作</td></tr>";
            $(da.list).each(
                function(){
                    str += "<tr><td><input type='checkbox'  class='u-inputcheckbox tr-sel' name='idList' value='" + this.id + "'/></td><td><a class='w320 text-of' href='javascript:newWinInfo(\"点评内容\",\"" + this.content.replace(/\n/g, '<br>') + "\")'>"
                        + this.content
                        + "</a></td><td>"
                        + this.publishtimeName
                        + "</td><td><a href='javascript:ymPrompt.win({message:\"reciptine.html?id=" + this.id + "\",width:360,height:380,title:\"查看接受学生\",iframe:true,showMask: true})'>"
                        + this.total
                        + "</a></td><td><a href='javascript:"
                        + "ymPrompt.win({message:\"selectFindOne.html?id=" + this.id + "\",width:360,height:380,title:\"查看学生点评\",iframe:true,showMask: true})"
                        + "'>查看</a>    <a href='javascript:void(0);' onclick='forword("
                        + this.id
                        + ");'>转发</a></td></tr>";
                });
            $(options.returnPage).html(str);
            //总条数 da.total
            options.pageCount = da.total;
            //生成分页
            $('.tab-pagination').pagination({
                items: options.pageCount,
                itemsOnPage: options.pageSize,
                currentPage: options.pageNumber,
                onPageClick: function(page){
                    options.pageSize = page.pageSize;
                    options.pageNumber = page.pageNumber;
                    getPageCommentSelect(options)
                }
            });

        }
    });
}
//学生点评草稿箱
var getPageCommentDeaft = function(options){
    var path = $("#path").val();
    $.ajax({
        url: path + "/comment/deaft",
        data: "pageNumber=" + options.pageNumber + "&itemsOnPage=" + options.pageSize,
        dataType: "json",
        type: "post",
        success: function(da){
            var str = "<tr><td width='7%'><input type='checkbox' class='u-inputcheckbox all-selected' /></td><td width='320'>点评内容</td><td width='20%'>创建时间</td><td width='20%'>接受人</td><td width='20%'>操作</td></tr>";
            $(da.list).each(function(){
                str += "<tr><td><input type='checkbox' name='idList' class='u-inputcheckbox tr-sel' value='" + this.id + "'/></td><td><span class='w320 text-of'>" + this.content + "</span></td><td>" + this.publishtimeName + "</td><td><a href='javascript:ymPrompt.win({message:\"reciptine.html?id=" + this.id + "\",width:360,height:380,title:\"查看接收人\",iframe:true,showMask: true})'>" + this.total + "</a></td><td><a href='updateFindOne?id=" + this.id + "'>修改</a>&nbsp;&nbsp;&nbsp;<a href='javascript:void(0);' onclick='del(" + this.id + ");'>删除</a></td></tr>";
            });
            $(options.returnPage).html(str);
            //总条数 da.total
            options.pageCount = da.total;
            //生成分页
            $('.tab-pagination').pagination({
                items: options.pageCount,
                itemsOnPage: options.pageSize,
                currentPage: options.pageNumber,
                onPageClick: function(page){
                    options.pageSize = page.pageSize;
                    options.pageNumber = page.pageNumber;
                    getPageCommentDeaft(options)
                }
            });
        }
    });
}

//----------------------------------------------------------------------班级模块----------------------------------

//班级列表分页
var getPagePageClassList = function(options){
    var path = $("#path").val();
    var parmester = {
        "pageNumber": options.pageNumber,
        "itemsOnPage": options.pageSize
    };
    $.ajax({
        url:"class/classList",
        data: parmester,
        dataType: "json",
        type: "post",
        success: function(da){
        	var upStr = "";
        	if(options.deleted || options.updated) upStr="<td>操作</td>"
            var str = "<tr class='thread'>" +
                "<td width='64'><input type='checkbox' class='u-inputcheckbox all-selected'>全选</td>" +
                "<td>所属年级</td>" +
                "<td>班级名称</td>" +
                "<td>操作人</td>" +
                "<td>操作时间</td>" +upStr +"</tr>";
            $(da.list).each(function(){
                str += "<tr>" +
                    "<td width='60'><input type='checkbox' name='idList' class='u-inputcheckbox tr-sel' value=" + this.id + "></td>" +
                    "<td>" + this.gradeName + "</td>" +
                    "<td>" + this.name + "</td>" +
                    "<td>" + this.createName + "</td>" +
                    "<td>" + new Date(this.createTime.time).Format("yyyy-MM-dd hh:mm:ss") + "</td>";

                if(options.deleted)
                    str += "<td><a href='javascript:loadRenderWin(\"" + $('#context').val() + "/organization/class/addStudents.html?id=" + this.id + "\", \"添加学生信息\", 560, 460)' class='tr-btn'>添加</a>";

                str += " <a href='javascript:loadRenderWin(\"" + $('#context').val() + "/organization/class/" + this.id + "/update.html\", \"班级修改\", 445, 240,true)' class='tr-btn'>修改</a>";
                if(options.updated)

                    var _url = 'class/' + this.id + '/delete.html', _type = 'class';
                str += "<a href='javascript:delYmpromptWin(500,230,\"" + _url + "\",\"" + _type + "\");' class='tr-btn'>删除</a>";
                str += "&nbsp;  <a href='javascript:loadRenderWin(\"class/detail.html?id=" + this.id + "\", \"查看学生信息\", 640, 460);'>查看</a></td></tr>";
                
            });

            $(options.returnPage).html(str);
            options.pageCount = da.total;
            //生成分页
            $('.tab-pagination').pagination({
                items: options.pageCount,
                itemsOnPage: options.pageSize,
                currentPage: options.pageNumber,
                onPageClick: function(page){
                    options.pageSize = page.pageSize;
                    options.pageNumber = page.pageNumber;
                    getPagePageClassList(options)
                }
            });
            /*  新增班级单个 / 批量 */
            var _addClassUrl = da.list.length > 0 ? path + '/organization/class/create.html' : path + '/organization/class/createBatch.html';
            $('.j-addclass').bind('click', function(){
                loadRenderWin(_addClassUrl, '新增班级', 455, 390);
            })
        }
    });
};

//------------------------------------------------------------------------------------------学校模块-------------------------

//学校基本信息分页
var getPageSchoolList = function(options){
    var path = $("#context").val();
    var parmester = {};
    //parmester['username']=$.trim($("#username").val());
    parmester['name'] = $.trim($("#schoolname").val());
    parmester['schoolMaster'] = $.trim($("#schoolMaster1").val());
    parmester['provinceCode'] = $("#provinceCode1").val();
    parmester['cityCode'] = $("#cityCode1").val();
    parmester['state'] = $("#state1").val();
    parmester['pageNumber'] = options.pageNumber;
    parmester['itemsOnPage'] = options.pageSize;

    $.ajax({
        url: path + "/school/schoolJson",
        data: parmester,
        dataType: "json",
        type: "post",
        success: function(da){
            var str = "<tr class='thread'>" +
                "<td>编号</td>" +
                "<td>学校名称</td>" +
                "<td>省份</td>" +
                "<td>城市</td>" +
                "<td>联系人</td>" +
                "<td>电话</td>" +
                "<td>用户状态</td>" +
                "<td>操作人</td>" +
                "<td>操作</td>" +
                "</tr>";
            $(da.list).each(function(){
                str += "<tr><td>" + this.id + "</td><td>" +
                    this.name + "</td><td>" +
                    this.provinceName + "</td><td>" +
                    this.cityName + "</td><td>" +
                    this.schoolMaster + "</td><td>" +
                    this.telephone + "</td><td>" +
                    this.stateName + "</td><td>" +
                    this.updatename + "</td>";
                var _url = path + '/school/delete.html?ids=' + this.id, _type = 'school';
                str += "<td><a class='tr-btn' href='javascript:ymPrompt.win({message:\"" + path + "/school/detail.html?id=" + this.id + "\",width:360,height:480,title:\"查看学校信息\",iframe:true,showMask: true})' >查看</a>&nbsp;&nbsp;&nbsp;<a class='u-formShow tr-btn' href=\"javascript:loadRenderWin('" + path + "/school/updateschool.html?id=" + this.id + "', '修改学校', 640, 460);\">修改</a><a class='tr-btn' href='javascript:del(\""+ _url + "\");'>删除</a></td></tr>";
            });
            $(options.returnPage).html(str);
            options.pageCount = da.total;
            //生成分页
            $('.tab-pagination').pagination({
                items: options.pageCount,
                itemsOnPage: options.pageSize,
                currentPage: options.pageNumber,
                onPageClick: function(page){
                    options.pageSize = page.pageSize;
                    options.pageNumber = page.pageNumber;
                    getPageSchoolList(options)
                }
            });

        }
    });

}

var getPagePointsChange = function(options){
    $('.tab-pagination').pagination({
        items: options.pageCount,
        itemsOnPage: options.pageSize,
        currentPage: options.pageNumber,
        onPageClick: function(page){
            options.pageSize = page.pageSize;
            options.pageNumber = page.pageNumber;
            getPagePointsChange(options)
        }
    });
}
//日考勤查询
var getPageAttendanceSelect = function(options){
    var time = $("#time").val();
    var cla = $("#class").val();
    var hidden = $("#hidden").val();
    var directTo = $("#directTo").val();
    var path = $("#path").val();
    var parmester = {};
    parmester['attendance.classId'] = cla;
    parmester['attendance.time'] = time;
    parmester['stuid'] = hidden;
    parmester['claId'] = $("#claId").val();
    parmester['pageNumber'] = options.pageNumber;
    parmester['itemsOnPage'] = options.pageSize;
    $.ajax({
        url: path + "/attendance/" + directTo,
        data: parmester,
        dataType: "json",
        success: function(da){
            var str;
            if(directTo == 'day'){
                str = "<tr><td width='100px'>考勤时间</td><td width='100px'>学生姓名</td><td width='100px'>到校时间</td><td width='100px'>离校时间</td><td width='100px'>状态</td></tr>";
                if(da.list == null || da.list == ''){
                    str += "<tr><td colspan='6'>暂无数据</td></tr>";
                }else{
                    $(da.list).each(
                        function(){
                            str += "<tr><td>" + this.time
                                + "</td><td>" + this.name
                                + "</td><td>";
                            if(this.arrivetime != null){
                                str += new Date(this.arrivetime).Format("hh:mm:ss");
                            }else{
                                str += "";
                            }
                            str += "</td><td>";
                            if(this.leavetime != null){
                                str += new Date(this.leavetime).Format("hh:mm:ss");
                            }else{
                                str += "";
                            }
                            str += "</td><td>" + this.stateStr
                                + "</td></tr>";
                        });
                }

            }
            else{
                str = "<tr><td width='100px'>考勤时间</td><td width='100px'>学生姓名</td><td width='100px'>迟到天数</td><td width='100px'>早退天数</td><td width='100px'>无记录</td><td width='100px'>状态</td></tr>";
                if(da.list == null || da.list == ''){
                    str += "<tr><td colspan='6'>暂无数据</td></tr>";
                }else{
                    $(da.list).each(
                        function(){
                            str += "<tr><td>" + this.time
                                + "</td><td>" + this.name
                                + "</td><td>" + this.late
                                + "</td><td>" + this.leave
                                + "</td><td>" + this.record + "</td><td>" + this.stateStr
                                + "</td></tr>";
                        });
                }

            }
            $(options.returnPage).html(str);
            //总条数 da.total
            options.pageCount = da.total;
            //生成分页
            $('.tab-pagination').pagination({
                items: options.pageCount,
                itemsOnPage: options.pageSize,
                currentPage: options.pageNumber,
                onPageClick: function(page){
                    options.pageSize = page.pageSize;
                    options.pageNumber = page.pageNumber;
                    getPageAttendanceSelect(options)
                }
            });
        }
    });
}


//教师列表分页
var getPageTeacherList = function(options){
    var parmester = {
        "pageNumber": options.pageNumber,
        "itemsOnPage": options.pageSize
    };
    $.ajax({
        url: "teacher/teacherList",
        data: parmester,
        dataType: "json",
        type: "post",
        success: function(da){
            var str = "<tr><td width='64'><input type='checkbox' class='u-inputcheckbox all-selected'>全选</td>" +
                "<td>教师姓名</td>" +
                "<td>昵称</td>" +
                "<td>联系方式</td>" +
                " <td>所属角色</td>" +
                " <td>所教科目</td>" +
                " <td>操作人</td>" +
                "<td>操作时间</td>" +
                "<td>操作</td>";
            $(da.list).each(function(){
                str += "<tr><td><input id='idList' name='idList' type='checkbox' class='u-inputcheckbox tr-sel' value='" + this.id + "'/></td>" +
                    "<td>" + this.name + "</td>" +
                    "<td>" + this.username + "</td>" +
                    "<td>" + this.mobile + "</td>";
                if(this.roleIds != null){
                    $.ajax({
                        url: "teacher/roleNames",
                        data: "roleIds=" + this.roleIds,
                        dataType: "json",
                        type: "post",
                        async: false,
                        success: function(da){
                            str += "<td>" + da.s + "</td>";
                        }
                    });
                }else{
                    str += "<td></td>";
                }
                str += "<td>" + this.course + "</td>";

                str += "<td>" + this.createName + "</td>" +
                    "<td>" + new Date(this.updateTime.time).Format("yyyy-MM-dd hh:mm:ss") + "</td>" +
                    "<td width='165'><a href='javascript:loadRenderWin(\"teacher/detail.html?id=" + this.id + "\", \"查看管理员信息\", 550, 400);'  class='tr-btn'>查看</a>" +
                    "<a href='javascript:loadRenderWin(\"teacher/" + this.id + "/update.html\",\"教师修改\",420,260,false,resizeYmprompt)'  class='tr-btn'>修改</a>";
                var _url = 'teacher/' + this.id + '/delete.html', _type = 'teacher';
                str += "<a class='tr-btn' href='javascript:loadRenderWin(\"teacher/setRoles.html?id=" + this.id + "\",\"教师角色管理\",560,420)'>角色</a><a href='javascript:delYmpromptWin(500,230,\"" + _url + "\",\"" + _type + "\");'  class='tr-btn'>删除</a></td></tr>";

            });



            $(options.returnPage).html(str);
            options.pageCount = da.total;
            //生成分页
            $('.tab-pagination').pagination({
                items: options.pageCount,
                itemsOnPage: options.pageSize,
                currentPage: options.pageNumber,
                onPageClick: function(page){
                    options.pageSize = page.pageSize;
                    options.pageNumber = page.pageNumber;
                    getPageTeacherList(options)
                }
            });

        }
    });
}
//管理员列表分页
var getPageAdminList = function(options){

    var parmester = {
        "pageNumber": options.pageNumber,
        "itemsOnPage": options.pageSize
    };
    $.ajax({
        url: "admin/adminList",
        data: parmester,
        dataType: "json",
        type: "post",
        success: function(da){
            var str = "<tr><td width='30'>选择</td>" +
                "<td width='30'>编号</td>" +
                "<td width='80'>帐号名称</td>" +
                "<td>帐号电话</td>" +
                " <td>帐号地址</td>" +
                "<td>是否付费</td>" +
                "<td>操作人</td>" +
                "<td width='64'>操作时间</td>" +
                "<td>操作</td></tr>";
            $(da.list).each(function(){
                var free = this.free;
                free == true ? free = "是" : free = "否";
                str += "<tr><td><input id='idList' name='idList' type='checkbox' class='u-inputcheckbox' value='" + this.id + "'/></td>" +
                    "<td>" + this.id + "</td>" +
                    "<td>" + this.username + "</td>" +
                    "<td>" + this.mobile + "</td>" +
                    "<td>" + this.address + "</td>" +
                    "<td>" + free + "</td>" +
                    "<td>" + this.createName + "</td>" +
                    "<td>" + new Date(this.updateTime.time).Format("yyyy-MM-dd hh:mm:ss") + "</td>" +
                    "<td><a href='javascript:loadRenderWin(\"admin/detail.html?id=" + this.id + "\", \"查看管理员信息\", 640, 460);'>查看</a>&nbsp&nbsp" +
                        // "<a href='admin/" + this.id + "/changePassword'>改密</a>&nbsp&nbsp" +
                    "<a href='admin/" + this.id + "/update'>修改</a>&nbsp&nbsp";
                var _url = "admin/" + this.id + "/delete.html", _type = "admin";
                str += "<a href='javascript:del(\""+ _url + "\");'>删除</a></td></tr>";


            });
            $(options.returnPage).html(str);
            options.pageCount = da.total;
            //生成分页
            $('.tab-pagination').pagination({
                items: options.pageCount,
                itemsOnPage: options.pageSize,
                currentPage: options.pageNumber,
                onPageClick: function(page){
                    options.pageSize = page.pageSize;
                    options.pageNumber = page.pageNumber;
                    getPageAdminList(options)
                }
            });

        }
    });
}
//管理员列表分页
var getPageAdminLists = function(options){
    var parmester = {
        "pageNumber": options.pageNumber,
        "itemsOnPage": options.pageSize
    };
    $.ajax({
        url: "admin/listAll",
        data: parmester,
        dataType: "json",
        type: "post",
        success: function(da){
            var str = "<tr><td width='30'>选择</td>" +
                "<td width='30'>编号</td>" +
                "<td width='80'>帐号名称</td>" +
                "<td>帐号电话</td>" +
                " <td>帐号地址</td>" +
                "<td>是否付费</td>" +
                " <td width='64'>有效期</td>" +
                "<td>操作人</td>" +
                "<td width='64'>操作时间</td>" +
                "<td>操作</td></tr>";
            $(da.list).each(function(){
                str += "<tr><td><input id='idList' name='idList' type='checkbox' class='u-inputcheckbox' value='" + this.id + "'/></td>" +
                    "<td>" + this.id + "</td>" +
                    "<td>" + this.username + "</td>" +
                    "<td>" + this.mobile + "</td>" +
                    "<td>" + this.address + "</td>" +
                    "<td>" + this.free + "</td>" +
                    "<td>" + new Date(this.validity.time).Format("yyyy-MM-dd hh:mm:ss") + "</td>" +
                    "<td>" + this.createName + "</td>" +
                    "<td>" + new Date(this.updateTime.time).Format("yyyy-MM-dd hh:mm:ss") + "</td>" +
                    "<td><a href='javascript:loadRenderWin(\"admin/detail.html?id=" + this.id + "\", \"查看管理员信息\", 640, 460);'>查看详情</a>&nbsp&nbsp" +
                    "<a href='admin/" + this.id + "/changePassword'>改密</a>&nbsp&nbsp" +
                    "<a href='admin/" + this.id + "/update'>修改</a>&nbsp&nbsp";
                var _url = "admin/" + this.id + "/delete.html", _type = "admin";
                str += "<a href='javascript:delYmpromptWin(500,230,\"" + _url + "\",\"" + _type + "\");'>删除</a></td></tr>";

            });
            $(options.returnPage).html(str);
            options.pageCount = da.total;
            //生成分页
            $('.tab-pagination').pagination({
                items: options.pageCount,
                itemsOnPage: options.pageSize,
                currentPage: options.pageNumber,
                onPageClick: function(page){
                    options.pageSize = page.pageSize;
                    options.pageNumber = page.pageNumber;
                    getPageAdminLists(options)
                }
            });

        }
    });
}
//角色列表分页
var getPageRoleList = function(options){
    var parmester = {
        "pageNumber": options.pageNumber,
        "itemsOnPage": options.pageSize
    };
    $.ajax({
        url: "role/roleList",
        data: parmester,
        dataType: "json",
        type: "post",
        success: function(da){
            var str = "<tr><td width='32'>序号</td>" +
                "<td width='115'>角色名称</td>" +
                "<td>描述</td>" +
                "<td width='80'>操作人</td>" +
                "<td width='90'>操作</td></tr>";
            $(da.list).each(function(){
                str += " <tr><td><input id='idList' name='idList' type='checkbox' class='u-inputcheckbox' value='" + this.id + "'/></td>" +
                    "<td>" + this.role + "</td>" +
                    "<td>" + this.description + "</td>" ;
                	if(this.createName!=null){
                		str+="<td>" + this.createName + "</td>";
                	}else{
                		str+="<td></td>";
                	}        
                var _url = 'role/' + this.id + '/delete.html', _type = 'role';
                /* <a href='javascript:loadRenderWin(\"role/detail.html?resourceIds=" + this.resourceIds + "\", \"查看权限\", 640, 460);'>查看</a>&nbsp;&nbsp; */
                str += "<td><a href='role/" + this.id + "/update'>修改</a>&nbsp;&nbsp;" +
                    "<a href='javascript:delYmpromptWin(500,230,\"" + _url + "\",\"" + _type + "\");'>删除</a></td></tr>";
            });
            $(options.returnPage).html(str);
            options.pageCount = da.total;
            //生成分页
            $('.tab-pagination').pagination({
                items: options.pageCount,
                itemsOnPage: options.pageSize,
                currentPage: options.pageNumber,
                onPageClick: function(page){
                    options.pageSize = page.pageSize;
                    options.pageNumber = page.pageNumber;
                    getPageRoleList(options)
                }
            });

        }
    });
}

//运营商信息分页
var getPageSupplyList = function(options){
    var path = $("#context").val();
    var parmester = {};
    //parmester['username']=$.trim($("#username").val());
    parmester['pageNumber'] = options.pageNumber;
    parmester['itemsOnPage'] = options.pageSize;

    $.ajax({
        url: path + "/supply/supplyJson",
        data: parmester,
        dataType: "json",
        type: "post",
        success: function(da){
            var str = "<tr class='thread'>" +
                "<td>编号</td>" +
                "<td>机构名称</td>" +
                "<td>联系人</td>" +
                "<td>联系电话</td>" +
                "<td>机构类型</td>" +
                "<td>地址</td>" +
                "<td>操作人</td>" +
                "<td>操作时间</td>" +
                "<td>操作</td>" +
                "</tr>";
            $(da.list).each(function(){
                str += "<tr><td>" + this.id + "</td><td>" +
                    this.name + "</td><td>" +
                    this.master + "</td><td>" +
                    this.phone + "</td><td>" +
                    this.suptypeName + "</td><td>" +
                    this.address + "</td><td>" +
                    this.updatename + "</td><td>" +
                    this.time +
                    "</td><td><a class='u-formShow tr-btn' href=\"javascript:loadRenderWin('" + path + "/supply/updatesupply.html?id=" + this.id + "', '修改运营商', 640, 460);\">修改</a>&nbsp;&nbsp;&nbsp;<a class='tr-btn' href='javascript:void(0);' onclick='del(" + this.id + ");'>删除</a></td></tr>";
            });
            $(options.returnPage).html(str);
            options.pageCount = da.total;
            //生成分页
            $('.tab-pagination').pagination({
                items: options.pageCount,
                itemsOnPage: options.pageSize,
                currentPage: options.pageNumber,
                onPageClick: function(page){
                    options.pageSize = page.pageSize;
                    options.pageNumber = page.pageNumber;
                    getPageSupplyList(options)
                }
            });

        }
    });
}
//年级管理信息分页
var getPageGradeList = function(options){
    var path = $("#path").val();
    var parmester = {};
    parmester['pageNumber'] = options.pageNumber;
    parmester['itemsOnPage'] = options.pageSize;
    $.ajax({
        url: path + "/organization/grade/gradeList",
        data: parmester,
        dataType: "json",
        type: "post",
        success: function(da){
            var str = "<tr><td width='64'><input type='checkbox' class='u-inputcheckbox all-selected' />全选</td>" +
                "<td width='100'>年级名称</td>" +
                "<td width='100'>操作人</td>" +
                "<td>操作时间</td>" +
                "<td width='90'>操作</td></tr>";
            $(da.list).each(function(){
                str += "<tr><td><input id='idList' name='idList' type='checkbox'  class='u-inputcheckbox tr-sel'   value='" + this.id + "'/></td>" +
                    "<td>" + this.name + "</td>" +
                    " <td>" + this.createName + "</td>" +
                    "<td>" + new Date(this.createTime.time).Format("yyyy-MM-dd hh:mm:ss") + "</td>" +
                    "<td><a href='javascript: loadRenderWin(\"" + path + "/organization/grade/" + this.id + "/update.html\", \"年级修改\", 450, 195,true)'>修改</a>&nbsp&nbsp";
                var _url =path+ '/organization/grade/' + this.id + '/delete.html', _type = 'grade';
                str += "<a href='javascript:delYmpromptWin(500,230,\"" + _url + "\",\"" + _type + "\");'>删除</a></td></tr>";
            });
            $(options.returnPage).html(str);
            options.pageCount = da.total;
            //生成分页
            $('.tab-pagination').pagination({
                items: options.pageCount,
                itemsOnPage: options.pageSize,
                currentPage: options.pageNumber,
                onPageClick: function(page){
                    options.pageSize = page.pageSize;
                    options.pageNumber = page.pageNumber;
                    getPageGradeList(options)
                }
            });
            var _addGradeUrl = '', oh = 0;
            if(da.list.length > 0){
                _addGradeUrl = path + '/organization/grade/create.html';
                oh = 360;
            }else{
                _addGradeUrl = path + '/organization/grade/createBatch.html';
                oh = 260;
            }
            $('.j-addgrade').bind('click', function(){
                loadRenderWin(_addGradeUrl, '新增年级', 455, oh);
            })

        }
    });
}

//学校帐号信息分页
var getPageSchoolAdminList = function(options){
    var path = $("#context").val();
    var parmester = {};
    //parmester['username']=$.trim($("#username").val());
    parmester['schoolName'] = $.trim($("#schoolName").val());
    parmester['username'] = $.trim($("#username1").val());
    parmester['provinceCode'] = $("#provinceCode1").val();
    parmester['cityCode'] = $("#cityCode1").val();
    parmester['state'] = $("#state1").val();
    parmester['pageNumber'] = options.pageNumber;
    parmester['itemsOnPage'] = options.pageSize;

    $.ajax({
        url: path + "/schooladmin/schooladminJson",
        data: parmester,
        dataType: "json",
        type: "post",
        success: function(da){
            var str = "<tr class='thread'>" +
                "<td>登陆帐号</td>" +
                "<td>真实姓名</td>" +
                "<td>学校名称</td>" +
                "<td>联系电话</td>" +
                "<td>操作人</td>" +
                "<td>操作时间</td>" +
                "<td>操作</td>" +
                "</tr>";
            $(da.list).each(function(){
                str += "<tr><td>" + this.username + "</td><td>" +
                    this.realname + "</td><td>" +
                    this.schoolName + "</td><td>" +
                    this.mobile + "</td><td>" +
                    this.createName + "</td><td>" +
                    this.time +
                    "</td>";
                var _url = 'schooladmin/delete.html?id=' + this.id, _type = 'schooladmin';
                str += "<td><a class='u-formShow tr-btn' href='javascript:updateloadWin(" + this.id + ")'>修改</a>&nbsp;&nbsp;&nbsp;<a class='tr-btn' href='javascript:delYmpromptWin(500,230,\"" + _url + "\",\"" + _type + "\");'>删除</a></td></tr>";
            });
            $(options.returnPage).html(str);
            options.pageCount = da.total;
            //生成分页
            $('.tab-pagination').pagination({
                items: options.pageCount,
                itemsOnPage: options.pageSize,
                currentPage: options.pageNumber,
                onPageClick: function(page){
                    options.pageSize = page.pageSize;
                    options.pageNumber = page.pageNumber;
                    getPageSchoolAdminList(options)
                }
            });

        }
    });

}
//首页学校动态分类
var getPageIndexDynamic = function(options){
    var parmester = {
        "pageNumber": options.pageNumber,
        "itemsOnPage": options.pageSize
    };
    /*$.ajax({
     url:"",
     type:"post",
     data:parmester,
     dataType:"json",
     success:function(){
     $(options.returnPage).html(str);
     options.pageCount = da.total;*/
    $('.schoolDynamic ul li a').unbind('click');
    $('.schoolDynamic ul li a').bind('click', function(){
        ymPrompt.win({message: "<p style='margin:5px 10px;padding:5px 5px 30px;line-height:24px;'>" + $(this).html() + "</p>", width: 360, height: 420, title: "查看动态内容", showMask: true});
    });
    //生成分页
    options.pageCount = 1;
    $('.tab-pagination').pagination({
        items: options.pageCount,
        itemsOnPage: options.pageSize,
        currentPage: options.pageNumber,
        onPageClick: function(page){
            options.pageSize = page.pageSize;
            options.pageNumber = page.pageNumber;
            getPageIndexDynamic(options)
        }
    });
    /*}
     });*/
}

