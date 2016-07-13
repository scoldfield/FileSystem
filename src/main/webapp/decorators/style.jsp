<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib uri="http://www.opensymphony.com/sitemesh/decorator"
    prefix="decorator"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title><decorator:title default="装饰器title" /></title>
    <decorator:head/>
</head>
<body>
<%-- 
    <p><font color="red">This is style.jsp header</font></p>
    <hr>
    <jsp:include page="top.jsp"/>
    
    <jsp:include page="left.jsp"/>
    
    <decorator:body/>
    
    <hr>
    <p><font color="red">This is style.jsp footer</font></p>
    
    <jsp:include page="end.jsp"/>
    --%> 
    <center>
        <table border="1" width="95%" cellspacing="0" cellpadding="0" bgcolor="white">
            <tr>
                <td colspan="2">
                    <jsp:include page="top.jsp" />
                </td>
            </tr>
            <tr>
                <td width="15%" valign="top" align="center">
                    <jsp:include page="left.jsp"/>
                </td>
                <td width="690" height="400" align="center"valign="top" bgcolor="#FFFFFF">
                    <%-- <jsp:include page="right.jsp"/> --%>
                    <decorator:body/>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <%-- <%@include file="end.jsp" %> --%>
                    <jsp:include page="end.jsp" />
                </td>
            </tr>
        </table>
    </center>
    
</body>
</html>