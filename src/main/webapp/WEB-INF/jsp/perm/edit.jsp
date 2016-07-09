<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>部门管理</title>
</head>
<body>

<form action="${pageContext.request.contextPath}/permMng/editPost" method="post">
    <table border="1" align="center" width="1000">
        <tr>
            <td align="center">
                                                <b>姓名</b>
            </td>
            <td align="center">
                                                <b>角色</b>
            </td>
            <td align="center">
                                                <b>部门</b>
            </td>
            <td align="center">
                                                <b>是否是部门管理员</b>
            </td>
            <td align="center">
                                                <b>是否是档案管理员</b>
            </td>
            <td align="center">
                                                <b>操作</b>
            </td>
        </tr>
        
        <tr>
            <td>
                <input name="id" value="${userDto.id }" type="hidden">
                <%-- <input name="deptId" value="${userDto.deptId }" type="hidden"> --%>
                ${userDto.name }
            </td>
            <td>
                <select name="roleId">
                    <c:forEach items="${roles }" var="role">
                        <option value="${role.id }"  <c:if test="${role.id==userDto.roleId }" >selected="selected"</c:if> >${role.name }</option>
                    </c:forEach>
                </select>
            </td>
             <td>
                <select name="deptId">
                    <c:forEach items="${depts }" var="dept">
                        <option value="${dept.id }" >${dept.deptName }</option>
                    </c:forEach>
                </select>
            </td>
            <td>
                <select name="deptManager">
                    <option value="1"  <c:if test="${userDto.deptManager==true }" >selected="selected"</c:if> >是</option>
                    <option value="0"  <c:if test="${userDto.deptManager==false }" >selected="selected"</c:if> >否</option>
                </select>
            </td>
            <td>
                <select name="fileManager">
                    <option value="1"  <c:if test="${userDto.fileManager==true }" >selected="selected"</c:if> >是</option>
                    <option value="0"  <c:if test="${userDto.fileManager==false }" >selected="selected"</c:if> >否</option>
                </select>
            </td>
            <td align="center">
                                                    <input type="submit" value="确定">
            </td>
        </tr>
    </table>
</form>
    

</body>
</html>