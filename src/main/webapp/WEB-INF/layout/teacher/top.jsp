<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<div class="g-top f-cb">
    <a class="s-toplogo f-fl" href="javascript:void(0)"><img src="${pageContext.request.contextPath}/static/images/teacher_logo.png"/></a>
    <span class="versionInf f-fl">version (20160527-R11258)</span>
    <div class="m-toplogininf f-fr f-cb">
        <p class="welcome welcome-name f-fl">你好，<span class="j-userInfoName"></span> <span data-value="${sessionScope.currentRoles[0].roleName}" class="j-userInforoletype"></span></p>
        <div class="m-topusernav j-rolestab f-fl">
            <a class="mnav mnav-role j-userInfoswitchrole"></a>
            <ul class="subnav j-userLoginSwitch" data-value="<c:forEach items='${sessionScope.roles}' var='role'>${role.id}##${role.roleName},</c:forEach>"></ul>
        </div>
        <p class="welcome f-fl">您的积分为：<span class="j-userInfoPoints"></span></p>
        <div class="m-topusernav f-fl">
            <a class="mnav">设置</a>
            <ul class="subnav">
                <li><a href="${pageContext.request.contextPath}/teacher/personalSet/updTeacher">个人设置</a></li>
                <li><a href="${pageContext.request.contextPath}/teacher/personalSet/updPassword">修改密码</a></li>
            </ul>
        </div>
        <a class="quit f-fl" href="${pageContext.request.contextPath}/logout">退出</a>
    </div>
</div>