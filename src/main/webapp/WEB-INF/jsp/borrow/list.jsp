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

    <form action="${pageContext.request.contextPath }/borrow/searchPost" method="post">
        <table border="1" align="center" width="1000">
            <tr align="center">
                <td>
                    <b>档案发文字号</b>
                </td>
                <td>
                    <b>档案标题</b>
                </td>
                <td>
                    <b>操作</b>
                </td>
            </tr>
            <tr align="center">
                <td>
                    <input name="generateWord" placeholder="请输入档案的发文字号" />
                </td>
                <td>
                    <input name="fileTitle" placeholder="请输入档案的标题" />
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
                                                    <b>档案编号</b>
                </td>
                <td align="center">
                                                    <b>标题</b>
                </td>
                <td align="center">
                                                    <b>归属部门</b>
                </td>
                <td align="center">
                                                    <b>密级</b>
                </td>
                <td align="center">
                                                    <b>借阅情况</b>
                </td>
                <td align="center">
                                                    <b>操作</b>
                </td>
            </tr>
            
            <c:forEach items="${fileDtos }" var="fileDto">
            <tr>
                <td align="center">
                    ${fileDto.fileId }
                </td>
                <td>
                    ${fileDto.fileTitle }
                </td>
                <td align="center">
                    ${fileDto.belongedDeptName }
                </td>
                <td align="center">
                    ${fileDto.secretLevel }
                </td>
                <td align="center">
                    <c:if test="${fileDto.isBorrowed==true }">已借出</c:if>
                    <c:if test="${fileDto.isBorrowed==false }">可借</c:if>
                    
                </td>
                <td align="center">
                        <c:if test="${fileDto.isBorrowed==true }">借阅</c:if>
                        <c:if test="${fileDto.isBorrowed==false }"><a href="${pageContext.request.contextPath }/borrow/apply?fileId=${fileDto.id}">借阅</a></c:if>
                </td>
            </tr>
            </c:forEach>
        </table>
    </c:if>
    

</body>
</html>