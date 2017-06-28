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

<form action="${pageContext.request.contextPath}/deptMng/editPost" method="post">
    <table border="1" align="center" width="1000">
        <tr>
            <td align="center">
                                                <b>部门名称</b>
            </td>
            <td align="center">
                                                <b>负责人</b>
            </td>
            <td align="center">
                                                <b>档案管理人</b>
            </td>
            <td align="center">
                                                <b>部门人数</b>
            </td>
            <td align="center">
                                                <b>值班电话</b>
            </td>
            <td align="center">
                                                <b>操作</b>
            </td>
        </tr>
        
        <tr>
            <td>
                <input name="id" value="${deptDto.id }" type="hidden">
                <input name="deptName" value="${deptDto.deptName }">
            </td>
            <td>
                <select name="deptManagerId">
                        <option value="${deptDto.deptManagerId }" selected="selected">${deptDto.deptManager }
                    <c:forEach items="${canBeDeptMngers }" var="deptMnger">
                        <option value="${deptMnger.id }">${deptMnger.name }</option>
                    </c:forEach>
                </select>
            </td>
            <td>
                <select name="fileManagerId">
                    <%-- <option value="${deptDto.fileManagerId }" selected="selected">${deptDto.fileManager } --%>
                    <c:forEach items="${canBeFileMngers }" var="fileMnger">
                        <option value="${fileMnger.id }" <c:if test="${fileMnger.id==deptDto.fileManagerId }">selected="selected"</c:if>>${fileMnger.name }</option>
                    </c:forEach>
                </select>
            </td>
            <td>
                <input name="personNum" value="${deptDto.personNum }">
            </td>
            <td>
                <input name="deptPhone" value="${deptDto.deptPhone }">
            </td>
            <td align="center">
                <input type="submit" value="提交">&nbsp;
                <a href="${pageContext.request.contextPath }/deptMng/list" style="text-decoration: none">返回</a>
            </td>
        </tr>
    </table>
</form>
    

</body>
</html>