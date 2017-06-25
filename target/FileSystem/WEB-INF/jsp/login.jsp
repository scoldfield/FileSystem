<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <meta name="renderer" content="webkit">
    <title>档案管理系统 - 登录</title>
    <link href="${pageContext.request.contextPath}/static/images/favorite_ico.ico" rel="Shortcut Icon"/>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/static/css/login.css"/>
    <script type="text/javascript">window.erroinf = '${errorCode}';
    window.tips = '${tips}';
    window.usertype = "${userList}";
    window.path = '${pageContext.request.contextPath}'</script>
</head>
<body>
<div class="g-wrap f-pr">
    <!-- header -->
    <div class="g-top">
        <div class="wrap f-ma f-cb">
            <a class="s-logo f-fl" href="javascript:void(0)"><img src="${pageContext.request.contextPath}/static/images/logo-login.png"></a>
        </div>
    </div>
    <!-- main -->
    <div class="g-main main-outer">
        <div class="g-main main-inner">
            <div class="g-mainwrap f-ma f-cb">
                <div class="g-loginwrap f-fr">
                    <form action="" method="post" id="loginform">
                        <h2>用户登录</h2>
                        <ul class="m-formul j-glogin">
                            <li>
                                <div class="iptwrap username">
                                    <input type="text" class="u-ipt j-ipt j-usernumber" name="username" id="username" placeholder="请输入账号名称" value="<shiro:principal/>"/>
                                </div>
                            </li>
                            <li>
                                <div class="iptwrap password">
                                    <input type="password" class="u-ipt j-ipt j-userpassword" name="password" id="password" placeholder="请输入密码"/>
                                </div>
                            </li>
                            <li class="f-cb">
                                <input type="button" class="u-lgbtn lgbtn j-getlogin  f-fl" value="登录">
                            </li>
                        </ul>
                        <%-- 错误信息 --%>
                        <div class="g-errotips j-erroinf"></div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div class="g-footer">
        <p class="wrap f-ma"></p>
    </div>
</div>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/js/lib/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/js/lib/jQuery.md5.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/js/login.js"></script>
</body>
</html>