<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
<div class="g-top">
    <div class="m-logowrap f-cb">
        <img src="${pageContext.request.contextPath}/static/images/logo.png" alt="校讯通" class="logo">
        校讯通 +(20160527-R11258)
    </div>
    <div class="m-loginInf f-cb">
        <a class="set" href="javascript:void(0)">设置</a>
        <a class="quit" href="${pageContext.request.contextPath}/logout">退出</a>
        <div class="m-userface">
            <img src="${pageContext.request.contextPath}/static/images/face.png" alt="">
        </div>
        <p class="welcome">你好，<shiro:principal/></p>
    </div>
</div>