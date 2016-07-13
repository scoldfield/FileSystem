<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>日志列表</title>
</head>
<body>

    <table border="1" align="center" width="95%">
        <tr>
            <td align="center">
                                                <b>操作人</b>
            </td>
            <td align="center">
                                                <b>操作时间</b>
            </td>
            <td align="center">
                                                <b>操作类名</b>
            </td>
            <td align="center">
                                                <b>操作方法名</b>
            </td>
            <td align="center">
                                                <b>操作参数</b>
            </td>
        </tr>
        
        <c:forEach items="${logs }" var="log">
            <tr>
                <td align="center">
                    ${log.operateUsername }
                </td>
                <td>
                    ${log.operateTime }
                </td>
                <td>
                    <div style="width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${log.className }">
                        ${log.className }"
                    </div>
                </td>
                <td>
                    <div style="width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${log.methodName }">
                        ${log.methodName }
                    </div>
                </td>
                <td align="center">
                        <c:if test="${log.params==null }">没有参数</c:if>
                        <c:if test="${log.params!=null }">${log.params }</c:if>
                </td>
            </tr>
        </c:forEach>
    </table>

</body>
</html>