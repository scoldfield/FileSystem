<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<!-- 所有的借阅请求通过、不通过、待审核的列表页面 -->
</head>
<body>

    <table border="1" align="center" width="1500">
        <tr align="center">
            <td>
                <b>档案标题</b>
            </td>
            <td>
                <b>归属部门</b>
            </td>
            <td>
                <b>申请人名字</b>
            </td>
            <td>
                <b>申请人部门</b>
            </td>
            <td>
                <b>申请时间</b>
            </td>
            <td>
                <b>是否通过</b>
            </td>
            <td>
                <b>操作</b>
            </td>
        </tr>
        <c:forEach items="${borrowAuditDtoList }" var="borrowAuditDto">
            <tr align="center">
                <td>
                    ${borrowAuditDto.fileName }
                </td>
                <td>
                    ${borrowAuditDto.deptName }
                </td>
                <td>
                    ${borrowAuditDto.applyUserName }
                </td>
                <td>
                    ${borrowAuditDto.applyDeptName }
                </td>
                <td>
                    ${borrowAuditDto.applyTime }
                </td>
                <td>
                    <c:if test="${borrowAuditDto.disabled==2 }">待审核</c:if>
                    <c:if test="${borrowAuditDto.disabled==1 }">已通过</c:if>
                    <c:if test="${borrowAuditDto.disabled==0 }">未通过</c:if>
                    <c:if test="${borrowAuditDto.disabled==-2 }">已删除</c:if>
                    
                </td>
                <td>
                    <a href="${pageContext.request.contextPath }/borrow/auditPost?fileId=${borrowAuditDto.fileId }&applyUserId=${borrowAuditDto.applyUserId }&deptId=${borrowAuditDto.deptId }&auditRes=1">同意&nbsp</a>
                    <a href="${pageContext.request.contextPath }/borrow/auditPost?fileId=${borrowAuditDto.fileId }&applyUserId=${borrowAuditDto.applyUserId }&deptId=${borrowAuditDto.deptId }&auditRes=0">不同意</a>
                </td>
            </tr>
        </c:forEach>
    </table>

</body>
</html>