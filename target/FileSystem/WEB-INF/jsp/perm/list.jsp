<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>
	<table border="1" align="center" width="95%">
        <tr>
            <td align="center">
                                                <b>姓名</b>
            </td>
            <td align="center">
                                                <b>身份(角色)</b>
            </td>
            <td align="center">
                                                <b>部门</b>
            </td>
            <td align="center">
                                                <b>借阅权限</b>
            </td>
            <td align="center">
                                                <b>操作</b>
            </td>
        </tr>
        
        <c:forEach items="${userDtos }" var="userDto">
            <tr>
                <td align="center">
                    ${userDto.name }
                </td>
                <td align="center">
                    <c:if test="${userDto.roleName!=null }">${userDto.roleName }</c:if>
                    <c:if test="${userDto.roleName==null }">未分配角色</c:if>
                </td>
                <td align="center">
                    ${userDto.dept }
                </td>
                <td align="center">
                    <div style="width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${userDto.resourceNames }">
                        <%-- <c:forEach items="${userDto.resourceNames }" var="resName">
                            ${resName }
                        </c:forEach> --%>
                        ${userDto.resourceNames }
                    </div>
                </td>
                <td align="center">
                    <c:if test="${userDto.roleName==null }"><a href="${pageContext.request.contextPath }/permMng/addRole?userId=${userDto.id }" style="text-decoration-color: #111111;background-color: #a8a8a8;text-decoration-line: none">去分配角色</a></c:if>
                    <c:if test="${userDto.roleName!=null }"><a href="${pageContext.request.contextPath }/permMng/editRole?userId=${userDto.id }" style="text-decoration-color: #111111;background-color: #a8a8a8;text-decoration-line: none">修改</a></c:if>
                </td>
            </tr>
        </c:forEach>
    </table>
</body>
</html>