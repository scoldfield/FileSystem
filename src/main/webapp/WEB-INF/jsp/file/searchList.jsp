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

<form action="${pageContext.request.contextPath }/fileMng/searchPost" method="post">
    <table border="1" align="center" width="1000">
        <tr align="center">
            <td>
                <b>档案发文类型</b>
            </td>
            <td>
                <b>档案承接部门</b>
            </td>
            <td>
                <b>操作</b>
            </td>
        </tr>
        <tr align="center">
            <td>
                <select name="generateType">
                    <c:forEach items="${wordTypes}" var="wordType">
                        <option value="${wordType}">${wordType}</option>
                    </c:forEach>
                </select>
            </td>
            <td>
                <select name="deptId">
                    <c:forEach items="${depts}" var="dept">
                        <option value="${dept.id}">${dept.deptName}</option>
                    </c:forEach>
                </select>
            </td>
            <td>
                <input type="submit" value="提交"/>
            </td>
        </tr>
    </table>
</form>

<!-- 分割线 -->
<hr width=80% size=3 color=#5151A2 style="FILTER: alpha(opacity=100,finishopacity=0,style=3)">

<c:if test="${fileDtos!=null }">
    <table border="1" align="center" width="1000">
        <tr>
            <td align="center">
                <b>档案发文类型</b>
            </td>
            <td align="center">
                <b>档案发文机关</b>
            </td>
            <td align="center">
                <b>标题</b>
            </td>
            <td align="center">
                <b>承办部门</b>
            </td>
            <td align="center">
                <b>承办人</b>
            </td>
        </tr>

        <c:forEach items="${fileDtos }" var="fileDto">
            <tr>
                <td align="center">
                        ${fileDto.generateType }
                </td>
                <td>
                        ${fileDto.generateAgency }
                </td>
                <td align="center">
                        ${fileDto.fileTitle }
                </td>
                <td align="center">
                        ${fileDto.belongedDeptName }
                </td>
                <td align="center">
                        ${fileDto.receiveUserName }
                </td>
            </tr>
        </c:forEach>
    </table>
</c:if>


</body>
</html>