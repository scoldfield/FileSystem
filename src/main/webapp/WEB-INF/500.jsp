<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>500错误</title>
</head>
<body>
<div class="errorBox">
	<div class="error500">
	 	<h1>抱歉，页面访问错误。</h1>
		<span>若多次出现该问题，可查看用户手册或联系当地运营商</span>
		<div class="ta-center mg-top20 clear-float"><a class="mg20" href="javascript:history.go(-1)">返回上一页</a><a class="mg20 mg-left70" href="${pageContext.request.contextPath}/index">返回首页</a></div>
	 </div>
</div>
</body>
</html>