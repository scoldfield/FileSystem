<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>部门管理</title>
</head>
<body>

    <div align="right">
        <a href="${pageContext.request.contextPath }/deptMng/add" style="text-decoration-line: none">新增</a>
    </div>

    <table border="1" align="center" width="95%">
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
        
        <c:forEach items="${deptDtos }" var="deptDto">
            <tr>
                <td align="center">
                    ${deptDto.deptName }
                </td>
                <td align="center">
                    ${deptDto.deptManager }
                </td>
                <td align="center">
                    ${deptDto.fileManager }
                </td>
                <td align="center">
                    ${deptDto.personNum }
                </td>
                <td align="center">
                    ${deptDto.deptPhone }
                </td>
                <td align="center">
                        <a href="${pageContext.request.contextPath }/deptMng/detail?deptId=${deptDto.id}" style="text-decoration-line: none">查看详情&nbsp</a>
                        <a href="${pageContext.request.contextPath }/deptMng/edit?deptId=${deptDto.id}" style="text-decoration-line: none">修改&nbsp</a>
                        <a href="${pageContext.request.contextPath }/deptMng/delete?deptId=${deptDto.id}" style="text-decoration-line: none">删除</a>
                </td>
            </tr>
        </c:forEach>
    </table>

</body>
</html>