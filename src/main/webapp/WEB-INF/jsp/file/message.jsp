<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
  <head>
    <title>消息提示</title>
	<!-- <script type="text/javascript">
		$(function(){
				$.ajax({
					url:'${pageContext.request.contextPath}/fileMng/list',
					type:'get',
				}		
				)
			}		
		)
		
	</script>   -->  

  </head>
  
  <body>
  	<table align="center">
  	<tr>
  		<td>
  			<b>${message}</b><br>
  		</td>
  	</tr>
  	<tr>
  		<td>
	        <a href="${pageContext.request.contextPath }/fileMng/list">返回列表</a>
  		</td>
  	</tr>
        
        
        
  	</table>
  </body>
</html>