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

    <table border="1" align="center" width="1000">
        <tr>
            <td align="center">
                                                <b>用户编号</b>
            </td>
            <td align="center">
                                                <b>姓名</b>
            </td>
            <td align="center">
                                                <b>性别</b>
            </td>
            <td align="center">
                                                <b>所属部门</b>
            </td>
            <td align="center">
                                                <b>联系方式</b>
            </td>
            <td align="center">
                                                <b>职务</b>
            </td>
            <td align="center">
                                                <b>注册时间</b>
            </td>
            <td align="center">
                                                <b>操作</b>
            </td>
        </tr>
        
        <c:if test="${userDtos.size()==0 }">
            <tr>
                <td>
                                        没有需要激活的用户
                 </td>
            </tr>
        </c:if>
        <c:if test="${userDtos.size()!=0 }">
            <c:forEach items="${userDtos }" var="userDto">
                <tr>
                    <td align="center">
                        ${userDto.jobId }
                    </td>
                    <td>
                        ${userDto.name }
                    </td>
                    <td>
                        <c:if test="${userDto.sex==false }">女</c:if>
                        <c:if test="${userDto.sex==true }">男</c:if>
                        
                    </td>
                    <td>
                        ${userDto.dept }
                    </td>
                    <td>
                        ${userDto.mobile }
                    </td>
                    <td>
                        ${userDto.roleName }
                    </td>
                    <td>
                        ${userDto.createTime }
                    </td>
                    <td align="center">
                        <c:if test="${userDto.state==false }">
                            <a href="${pageContext.request.contextPath }/userMng/userAuditPost?userId=${userDto.id}&result=1">通过</a>
                            <%--<a href="${pageContext.request.contextPath }/userMng/userAuditPost?userId=${userDto.id}&result=0">不通过</a>--%>
                        </c:if>
                            <%-- <a href="${pageContext.request.contextPath }/userMng/edit?userId=${user.id}">修改&nbsp</a>
                            <a href="${pageContext.request.contextPath }/userMng/delete?userId=${user.id}">删除</a> --%>
                    </td>
                </tr>
            </c:forEach>
        </c:if>
    </table>

</body>
</html>