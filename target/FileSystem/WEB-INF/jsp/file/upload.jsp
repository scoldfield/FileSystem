<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>文件上传</title>
</head>
<body>
	<form action="${pageContext.request.contextPath}/fileMng/uploadPost" enctype="multipart/form-data" method="post">
        <table border="1" align="center" width="95%">
            <tr>
                <td align="center">
                                                    上传文件：
                </td>
                <td>
                    <input type="file" name="file1"><br/>
                </td>
            </tr>
            <tr>
                <td>
                </td>
                <td>
                    <input type="submit" value="提交" style="margin:auto">&nbsp;&nbsp;&nbsp;&nbsp;
                    <a href="${pageContext.request.contextPath }/fileMng/list" style="text-decoration-line: none;font-size: small">返回</a>
                </td>
            </tr>
        </table>
		<input type="hidden" name="fileId" value="${fileId }"><br/>
		<!-- <input type="hidden" name="fileId" value="1"><br/> -->
		
		
	</form>
</body>
</html>