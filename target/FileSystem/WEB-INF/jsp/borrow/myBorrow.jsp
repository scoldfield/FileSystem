<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>

        <table border="1" align="center" width="95%">
            <tr align="center">
                <td>
                    <b>档案文字号</b>
                </td>
                <td>
                    <b>档案标题</b>
                </td>
                <td>
                    <b>归属部门</b>
                </td>
                <td>
                    <b>密级</b>
                </td>
                <td>
                    <b>借阅情况</b>
                </td>
                <td>
                    <b>操作</b>
                </td>
            </tr>
            
            <c:forEach items="${borrowAuditDtos }" var="borrowAuditDto">
	            <tr align="center">
	                <td>
	                    ${borrowAuditDto.generateWord }
	                </td>
	                <td>
	                    ${borrowAuditDto.fileTitle }
	                </td>
	                <td>
	                    ${borrowAuditDto.deptName }
	                </td>
	                <td>
	                    ${borrowAuditDto.secretLevel }
	                </td>
	                <td>
	                	<c:if test="${borrowAuditDto.disabled==1 }">同意借阅</c:if>
	                	<c:if test="${borrowAuditDto.disabled==2 }">待审核</c:if>
	                	<c:if test="${borrowAuditDto.disabled==-1 }">已归还</c:if>
	                	<c:if test="${borrowAuditDto.disabled==0 }">不同意借阅</c:if>
	                </td>
	                <td>
                        <c:if test="${borrowAuditDto.disabled==1 }">
                            <a href="${pageContext.request.contextPath }/fileMng/download?fileId=${borrowAuditDto.fileId}" style="text-decoration-line: none">全文阅读</a>
                            <a href="${pageContext.request.contextPath }/borrow/returnFile?fileId=${fileDto.id}" style="text-decoration-line: none">归还档案</a>
                        </c:if>
                        <c:if test="${borrowAuditDto.disabled==0 }">权限不足，无法借阅</c:if>
	                </td>
	            </tr>
            </c:forEach>
        </table>
    	
</body>
</html>