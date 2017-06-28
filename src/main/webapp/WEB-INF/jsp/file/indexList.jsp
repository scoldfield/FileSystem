<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>部门管理</title>
</head>
<body>

    <table border="1" align="center" width="95%">
        <tr>
            <td align="center">
                                                <b>档案编号</b>
            </td>
            <td align="center">
                                                <b>标题</b>
            </td>
            <td align="center">
                                                <b>密级</b>
            </td>
            <td align="center">
                                                <b>操作</b>
            </td>
        </tr>
        
        <c:forEach items="${fileDtos }" var="fileDto">
            <tr>
                <td align="center">
                    ${fileDto.fileId }
                </td>
                <td align="center">
                    ${fileDto.fileTitle }
                </td>
                <td align="center">
                    ${fileDto.secretLevel}
                </td>
                <td align="center">
                        <a href="${pageContext.request.contextPath }/fileMng/detail?fileId=${fileDto.id}" style="text-decoration: none">查看&nbsp</a>
                        <a href="${pageContext.request.contextPath }/fileMng/edit?fileId=${fileDto.id}" style="text-decoration: none">修改&nbsp</a>
                        <a href="${pageContext.request.contextPath }/fileMng/delete?fileId=${fileDto.id}" style="text-decoration: none">删除</a>
                </td>
            </tr>
        </c:forEach>
    </table>

</body>
</html>