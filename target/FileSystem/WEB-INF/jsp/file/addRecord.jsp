<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
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
                                                <b>标题</b>
            </td>
            <td align="center">
                                                <b>经办人</b>
            </td>
            <td align="center">
                                                <b>审核人</b>
            </td>
            <td align="center">
                                                <b>审核时间</b>
            </td>
            </td>
            <td align="center">
                                                <b>审核结果</b>
            </td>
        </tr>
        
        <c:if test="${fileDtos.size()==0 }">
           <tr>
                <td>
                                     没有提交记录
             </td>
           </tr>
        </c:if>
        
        <c:forEach items="${fileDtos }" var="fileDto">
            <tr>
                <td>
                    ${fileDto.fileTitle }
                </td>
                <td align="center">
                    ${fileDto.receiveUserName }
                </td>
                <td align="center">
                	<c:if test="${fileDto.auditorName==null }">尚未审核</c:if>
                	<c:if test="${fileDto.auditorName!=null }">${fileDto.auditorName }</c:if>
                </td>
                <td align="center">
                	<c:if test="${fileDto.auditDate==null }">尚未审核</c:if>
                	<c:if test="${fileDto.auditDate!=null }"><fmt:formatDate value="${fileDto.auditDate }" pattern="yyyy-MM-dd HH:mm:ss"/></c:if>
                </td>
                <td align="center">
                    <!-- 审核结果：1：通过；0：未审核；-1：审核未通过 -->
                    <c:if test="${fileDto.auditResult==1 }">审核通过&nbsp</c:if>
                    <c:if test="${fileDto.auditResult==0 }">未审核&nbsp</c:if>
                    <c:if test="${fileDto.auditResult==-1 }">审核未通过&nbsp</c:if>
                    
                    <c:if test="${fileDto.fillingDate!=null }">已归档&nbsp</c:if>
                </td>
            </tr>
        </c:forEach>
    </table>
</body>
</html>