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
                                                <b>时间</b>
            </td>
            <td align="center">
                                                <b>绝密</b>
            </td>
            <td align="center">
                                                <b>机密</b>
            </td>
            <td align="center">
                                                <b>秘密</b>
            </td>
            <td align="center">
                                                <b>内部</b>
            </td>
            <td align="center">
                                                <b>普通</b>
            </td>
        </tr>
        
        <c:forEach items="${tables }" var="table">
            <tr>
                <td align="center">
                    ${table.yearTotal }
                </td>
                <td>
                    ${table.secret1 }
                </td>
                <td>
                    ${table.secret2 }
                </td>
                <td>
                    ${table.secret3 }
                </td>
                <td>
                    ${table.secret4 }
                </td>
                <td>
                    ${table.secret5 }
                </td>
            </tr>
        </c:forEach>
    </table>

</body>
</html>