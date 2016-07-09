<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
<div class="g-top">
    <div class="m-logowrap f-cb">
        <img src="${pageContext.request.contextPath}/static/images/logo.png" alt="校讯通" class="logo">
        校讯通 +(20160527-R11258)
    </div>
    <div class="m-loginInf f-cb">
        <div class="setwrap f-fl">
            <a class="set" href="javascript:void(0)">设置</a>
            <ul class="setcontent">
                <li><a href="${pageContext.request.contextPath}/platform/personalSet/updPassword">修改密码</a></li>
                <li><a href="${pageContext.request.contextPath}/platform/personalSet/updImageUrl">个人头像</a></li>
            </ul>
        </div>
        <a class="quit f-fl" href="${pageContext.request.contextPath}/logout">退出</a>
        <div class="m-userface">
            <img src="${pageContext.request.contextPath}/static/images/demo/and.png" alt="" id="face">
        </div>
        <p class="welcome">你好，<shiro:principal/></p>
    </div>
</div>