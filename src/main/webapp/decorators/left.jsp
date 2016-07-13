<%-- <%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>侧栏</title>
</head>
<body>
	<center>
		<table border="0" width="225" height="100%" cellspacing="0" cellpadding="0">
			
			<tr height="23">
				<td width="50%">
					<center>
						<h4>用户管理</h4>
					</center>
				</td>
			</tr>
			
			<tr height="23">
				<td width="50%">
					<center>
						<h4>部门管理</h4>
					</center>
				</td>
			</tr>
			
			<tr height="23">
				<td width="50%">
					<center>
						<h4>权限管理</h4>
					</center>
				</td>
			</tr>
			
			<tr height="23">
				<td width="50%">
					<center>
						<h4>系统日志</h4>
					</center>
				</td>
			</tr>
			
			<tr height="23">
				<td width="50%">
					<center>
						<h4>档案管理</h4>
					</center>
				</td>
			</tr>
			
			<tr height="23">
				<td width="50%">
					<center>
						<h4>借阅管理</h4>
					</center>
				</td>
			</tr>
			
			<tr height="23">
				<td width="50%">
					<center>
						<h4>业务管理</h4>
					</center>
				</td>
			</tr>
						
		</table>
	</center>
</body>
</html> --%>


<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@taglib uri="http://shiro.apache.org/tags" prefix="shiro" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>jQuery动画垂直折叠导航效果</title>
       
        <style type="text/css">
        .menu_list {
            width: 268px;
            margin: 0 auto;
        }
        
        .menu_head {
            height: 47px;
            line-height: 47px;
            padding-left: 38px;
            font-size: 14px;
            color: #525252;
            cursor: pointer;
            border-left: 1px solid #e1e1e1;
            border-right: 1px solid #e1e1e1;
            border-bottom: 1px solid #e1e1e1;
            border-top: 1px solid #F1F1F1;
            position: relative;
            margin: 0px;
            font-weight: bold;
            background: #f1f1f1 url("${pageContext.request.contextPath}/static/images/start/pro_left.png") center right no-repeat;
        }
        
        .menu_list .current {
            background: #f1f1f1 url("${pageContext.request.contextPath}/static/images/start/pro_down.png") center right no-repeat;
        }
        
        .menu_body {
            line-height: 38px;
            border-left: 1px solid #e1e1e1;
            backguound: #fff;
            border-right: 1px solid #e1e1e1;
        }
        
        .menu_body a {
            display: block;
            height: 38px;
            line-height: 38px;
            padding-left: 38px;
            color: #777777;
            background: #fff;
            text-decoration: none;
            border-bottom: 1px solid #e1e1e1;
        }
        
        .menu_body a:hover {
            text-decoration: none;
        }
        </style>
    </head>

    <body>
    
        <!-- 代码部分begin -->
        <div id="firstpane" class="menu_list">
            <shiro:hasPermission name="user:mngt">
                <h3 class="menu_head current">用户管理</h3>
                <div style="display: none" class="menu_body">
                    <a href="${pageContext.request.contextPath }/userMng/list">用户列表</a>
                    <shiro:hasPermission name="user:audit">
                        <a href="${pageContext.request.contextPath }/userMng/userAudit">用户审核</a>
                    </shiro:hasPermission>
                </div>
            </shiro:hasPermission>
     
            <shiro:hasPermission name="dept:mngt">
                <h3 class="menu_head"><a href="${pageContext.request.contextPath }/deptMng/list">部门管理</a></h3>
                <!-- <div style="display: none" class="menu_body">
                    <a href="#">应用经济学</a>
                    <a href="#">区域经济学</a>
                    <a href="#">劳动经济学</a>
                </div> -->
            </shiro:hasPermission>
            
            <shiro:hasPermission name="perm:mngt">
                <h3 class="menu_head">权限管理</h3>
                <div style="display: none" class="menu_body">
                    <a href="${pageContext.request.contextPath }/permMng/list">用户-角色</a>
                    <a href="${pageContext.request.contextPath }/permMng/listRoles">角色-权限</a>
                </div>
            </shiro:hasPermission>
            
            <shiro:hasPermission name="sys:mngt">
                <h3 class="menu_head"><a href="${pageContext.request.contextPath }/log/list">系统日志</a></h3>
                <!-- <div style="display: none" class="menu_body">
                    <a href="#">体育人文社会学</a>
                    <a href="#">发展与教育心理学</a>
                    <a href="#">课程与教学论</a>
                </div> -->
            </shiro:hasPermission>
            
            <shiro:hasPermission name="file:mngt">
                <h3 class="menu_head">档案管理</h3>
                <div style="display: none" class="menu_body">
                    <shiro:hasPermission name="file:detail">
                        <a href="${pageContext.request.contextPath }/fileMng/list">档案信息</a>
                    </shiro:hasPermission>
                    <shiro:hasPermission name="file:categ">
                        <a href="#">档案分类</a>
                    </shiro:hasPermission>
                    <shiro:hasPermission name="file:dir">
                        <a href="#">目录管理</a>
                    </shiro:hasPermission>
                </div>
            </shiro:hasPermission>
            
            <shiro:hasPermission name="borrow:mngt">
                <h3 class="menu_head">借阅管理</h3>
                <div style="display: none" class="menu_body">
                    <shiro:hasPermission name="borrow:list">
                        <a href="${pageContext.request.contextPath }/borrow/list">查询</a>
                    </shiro:hasPermission>
                    <%-- <shiro:hasPermission name="borrow:borrow">
                        <a href="#">借阅</a>
                    </shiro:hasPermission> --%>
                    <shiro:hasPermission name="borrow:record">
                        <a href="${pageContext.request.contextPath }/borrow/borrowRecord">借阅记录</a>
                    </shiro:hasPermission>
                </div>
            </shiro:hasPermission>
            
            <shiro:hasPermission name="biz:mngt">
                <h3 class="menu_head">业务管理</h3>
                <div style="display: none" class="menu_body">
                    <shiro:hasPermission name="biz:recv">
                        <a href="${pageContext.request.contextPath }/fileMng/add">接收档案</a>
                    </shiro:hasPermission>
                    <shiro:hasPermission name="biz:recevAudit">
                        <a href="${pageContext.request.contextPath }/biz/receiveAudit">接收档案审核</a>
                    </shiro:hasPermission>
                    <shiro:hasPermission name="biz:borrowAudit">
                        <a href="${pageContext.request.contextPath }/borrow/borrowList">借阅档案审核</a>
                    </shiro:hasPermission>
                    <shiro:hasPermission name="biz:record">
                        <a href="${pageContext.request.contextPath }/biz/fileTable">信息统计下载</a>
                    </shiro:hasPermission>
                </div>
            </shiro:hasPermission>
        </div>
        
        
        <script src="${pageContext.request.contextPath}/static/js/start/jquery.js"></script>
        <script>
    					$(document).ready(
    							function() {
    								$("#firstpane .menu_body:eq(0)").show();
    								$("#firstpane h3.menu_head").click(
    										function() {
    											$(this).addClass("current").next(
    													"div.menu_body")
    													.slideToggle(300).siblings(
    															"div.menu_body")
    													.slideUp("slow");
    											$(this).siblings().removeClass(
    													"current");
    										});
    								$("#secondpane .menu_body:eq(0)").show();
    								$("#secondpane h3.menu_head").mouseover(
    										function() {
    											$(this).addClass("current").next(
    													"div.menu_body").slideDown(
    													500).siblings(
    													"div.menu_body").slideUp(
    													"slow");
    											$(this).siblings().removeClass(
    													"current");
    										});
    							});
    				</script>
        <!-- 代码部分end -->
    
    </body>
</html>