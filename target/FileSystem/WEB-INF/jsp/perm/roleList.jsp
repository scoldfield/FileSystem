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
        <tr>
            <td align="center">
                                                <b>角色名</b>
            </td>
            <td align="center">
                                                <b>权限</b>
            </td>
            <td align="center">
                                                <b>操作</b>
            </td>
        </tr>
        
        <c:forEach items="${roleDtos }" var="roleDto">
            <tr>
                <td align="center">
                    ${roleDto.name }
                </td>
                <td align="center">
                    <%-- <c:forEach items="${roleDto.resources }" var="resource">
                        <div style="width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${resource.name }">
                            ${resource.name }
                        </div>
                    </c:forEach> --%>
                    <div style="width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${roleDto.resourceNames }">
                        ${roleDto.resourceNames }
                    </div>
                </td>
                <td align="center">
                    <a href="${pageContext.request.contextPath }/permMng/editPerm?roleId=${roleDto.id}" style="text-decoration-color: #111111;background-color: #a8a8a8;text-decoration-line: none">修改</a>
                </td>
            </tr>
        </c:forEach>
    </table>
    
</body>
</html>