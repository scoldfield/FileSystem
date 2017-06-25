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
                                                <b>归属部门</b>
            </td>
            <td align="center">
                                                <b>归档时间</b>
            </td>
            <td align="center">
                                                <b>页数</b>
            </td>
            <td align="center">
                                                <b>上传附件</b>
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
                    ${fileDto.belongedDeptName }
                </td>
                <td align="center">
                    <fmt:formatDate value="${fileDto.fillingDate }" pattern="yyyy-MM-dd HH:mm:ss"/>
                </td>
                <td align="center">
                    ${fileDto.generatePage }
                </td>
                <td align="center">
                    <c:if test="${fileDto.location==null }">	<!-- 判断附件是否上传 -->
                    	<a href="${pageContext.request.contextPath }/fileMng/upload?fileId=${fileDto.id}" style="text-decoration-line: none">上传附件</a>
                    </c:if>
                    <c:if test="${fileDto.location!=null }">
                    	附件已经上传<br>${fileDto.location }
                    </c:if>
                </td>
                <td align="center">
                        <a href="${pageContext.request.contextPath }/fileMng/detail?fileId=${fileDto.id}" style="text-decoration-line: none">查看&nbsp</a>
                        <a href="${pageContext.request.contextPath }/fileMng/edit?fileId=${fileDto.id}" style="text-decoration-line: none">修改&nbsp</a>
                        <a href="${pageContext.request.contextPath }/fileMng/delete?fileId=${fileDto.id}" style="text-decoration-line: none">删除</a>
                </td>
            </tr>
        </c:forEach>
    </table>

</body>
</html>