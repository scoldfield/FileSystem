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

<form action="${pageContext.request.contextPath}/permMng/editPermPost" method="post">
    <table border="1" align="center" width="95%">
        <tr>
            <td align="center">
                                                <b>角色名</b>
            </td>
            <td align="center">
                                                <b>已选权限</b>
            </td>
            <td align="center">
                                                <b>可供选择的权限</b>
            </td>
            <td align="center">
                                                <b>操作</b>
            </td>
        </tr>
        
        <%-- <c:forEach items="${roleDtos }" var="roleDto"> --%>
            <tr>
                <td align="center">
                    <input name="id" value="${roleDto.id }" type="hidden">
                    ${roleDto.name }
                </td>
                <td align="center">
                    <div style="width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${roleDto.resourceNames }">
                        ${roleDto.resourceNames }
                    </div>
                    <%-- <c:forEach items="${roleDto.resources }" var="resource">
                        ${resource.name }<br>
                    </c:forEach> --%>
                </td>
                <td align="center">
                    <c:if test="${roleDto.appendResources!=null }">
                        <c:forEach items="${roleDto.appendResources }" var="appendResource">
                            <input name="appendResourceIds" type="checkbox" value="${appendResource.id }">${appendResource.name}<br>
                        </c:forEach>
                    </c:if>
                    <c:if test="${roleDto.appendResources==null }">
                        没有可供选择的额外的权限
                    </c:if>
                </td>
                <td align="center">
                    <%-- <a href="${pageContext.request.contextPath }/permMng/editPerm?roleId=${roleDto.id}">修改</a> --%>
                    <input type="submit" value="提交"/>&nbsp;
                    <a href="${pageContext.request.contextPath }/permMng/listRoles" style="text-decoration-line: none">返回</a>
                </td>
            </tr>
        <%-- </c:forEach> --%>
    </table>
</form>
    
</body>
</html>